import { db } from "../config/db.js";
import { groupEvents } from "../utils/groupEvents.js";
import { normalizeSorting } from "../utils/normalizeSorting.js";

// GET functions

// Get All events with optional filters + pagination (GET)
// Figure out how many events exist → pick which ones belong on this page → get 
// their details
export const getAllEvents = async (filters = {}) => {
  const {  
    city, 
    subject,
    published, 
    limit = 10, 
    offset = 0, 
    sortBy = "starts_at", 
    sortOrder = "ASC",
 } = filters;

 const { safeSortBy, safeSortOrder } = normalizeSorting(sortBy, sortOrder);

// -------------------------
// SHARED FILTER LOGIC
// -------------------------

  const conditions = [];
  const values = [];

  if (published !== undefined) {
    conditions.push("e.is_published = ?");
    values.push(published === "true" ? 1 : 0);
  }

  if (city) {
    conditions.push("LOWER(v.city) = LOWER(?)");
    values.push(city);
  }

  if (subject) {
    const subjects = subject.split(",");
    const placeholders = subjects.map(() => "?").join(", ");
    conditions.push(`LOWER(s.name) IN (${placeholders})`);
    values.push(...subjects.map(s => s.toLowerCase()));
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // -----------------------------------
  //  METADATA PHASE (Total Count)
  // -----------------------------------
  const countQuery = `
    SELECT COUNT(DISTINCT e.event_id) AS total
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.venue_id
    LEFT JOIN event_subjects es ON e.event_id = es.event_id
    LEFT JOIN subjects s ON es.subject_id = s.subject_id
    ${whereClause}
  `;

  const [[{ total }]] = await db.query(countQuery, values);

  // -----------------------------------
  //  SELECTION PHASE (Paginated IDs)
  // -----------------------------------
  const idQuery = `
    SELECT DISTINCT e.event_id, e.starts_at
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.venue_id
    LEFT JOIN event_subjects es ON e.event_id = es.event_id
    LEFT JOIN subjects s ON es.subject_id = s.subject_id
    ${whereClause}
    ORDER BY e.${safeSortBy} ${safeSortOrder}
    LIMIT ? OFFSET ?
  `;

  const [idRows] = await db.query(idQuery, [...values, Number(limit), Number(offset)]);
  const eventIds = [...new Set(idRows.map(row => row.event_id))];

  // Early return if no results
  if (eventIds.length === 0) {
    return {
      data: [],
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
        hasNext: false,
        hasPrev: offset > 0
      }
    };
  }
 
if (!eventIds.length === 0) {
  return {
    data: [],
    pagination: {
      total,
      limit,
      offset,
      hasNext: false,
      hasPrev: offset > 0
    }
  };
}

 // -----------------------------------
  // RETRIEVAL PHASE (Full Event Data)
  // -----------------------------------
 // Build placeholders
 const placeholders = eventIds.map(() => "?").join(", ");

// Build query with expanded IN clause
const dataQuery = `
  SELECT 
    e.event_id,
    e.name,
    e.description,
    e.starts_at,
    e.ends_at,
    e.is_published,
    v.city,
    v.state,
    o.name AS organizer_name,
    t.price_cents,
    t.capacity,
    s.name AS subject_name
  FROM events e
  LEFT JOIN venues v ON e.venue_id = v.venue_id
  LEFT JOIN organizations o ON e.organization_id = o.organization_id
  LEFT JOIN ticket_types t ON e.event_id = t.event_id
  LEFT JOIN event_subjects es ON e.event_id = es.event_id
  LEFT JOIN subjects s ON es.subject_id = s.subject_id
  WHERE e.event_id IN (${placeholders})
`;

// Execute ONLY this query
const [eventRows] = await db.query(dataQuery, eventIds);


  // -----------------------------------
  // TRANSFORMATION PHASE (Normalize Data)
  // -----------------------------------
  const events = groupEvents(eventRows);

  // -----------------------------------
  // FINAL RESPONSE (Shape API Output)
  // -----------------------------------
  return {
    data: events,
    pagination: {
      total,
      limit: Number(limit),
      offset: Number(offset),
      hasNext: offset + limit < total,
      hasPrev: offset > 0
    }
  };
}

// Get single event by ID (GET)
export const getEventById = async (id) => {
  const query = (`
    SELECT
      e.event_id,
      e.name,
      e.starts_at,
      e.is_published,
      v.city,
      v.state,
      t.price_cents,
      t.capacity,
      o.name AS organizer_name,
      e.description,
      s.name AS subject_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.venue_id
    LEFT JOIN ticket_types t ON e.event_id = t.event_id
    LEFT JOIN organizations o ON e.organization_id = o.organization_id
    LEFT JOIN event_subjects es ON e.event_id = es.event_id
    LEFT JOIN subjects s ON es.subject_id = s.subject_id
    WHERE e.event_id = ?
  `);

    const [rows] = await db.query(query, [id]);

  if (!rows.length) return null;

  return groupEvents(rows)[0]; 
};

// Get all subjects for filtering (GET)
export async function getAllSubjects() {
  const [rows] = await db.query(`
    SELECT DISTINCT s.name AS name
    FROM subjects s
    ORDER BY s.name
  `);

  return rows;
}


// CREATE functions 

// Create Event request function (POST)
export const createEvent = async (eventData) => {    
  const {
    name,
    description,
    starts_at,
    ends_at,
    organization_id,
    venue_id,
    is_published = 0
  } = eventData;

  const [result] = await db.query(
    `
    INSERT INTO events (
      name,
      description,
      starts_at,
      ends_at,
      organization_id,
      venue_id,
      is_published
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      description || null,
      starts_at,
      ends_at || null,
      organization_id,
      venue_id,
      is_published ? 1 : 0
    ]
  );

  return {
    event_id: result.insertId,
    ...eventData,
    is_published: is_published ? 1 : 0
  };
};

// UPDATE functions

// Update Event request function (PUT)
export const updateEvent = async (id, updates) => {

 // Whitelist of allowed fields to update
   const allowedFields = [
    "name",
    "description",
    "starts_at",
    "ends_at",
    "organization_id",
    "venue_id",
    "is_published"
];

// SQL pieces
  const fields = [];
  const values = [];

  // Build update query safely (using allowedFields)
  for (let key in updates) {
    if (!allowedFields.includes(key)) {
      continue;
    }

    fields.push(`${key} = ?`);

    if (key === "is_published") {
      values.push(updates[key] ? 1 : 0);
    } else {
      values.push(updates[key]);
    }
  }

 // No valid fields -> reject
   if (!fields.length) {
    const rows = await getEventById(id);
    if (!rows.length) return null;

    return groupEvents(rows)[0]; 
   }

  // Build query
  const query = `
    UPDATE events
    SET ${fields.join(", ")}
    WHERE event_id = ?
  `;

  values.push(id);

 const [result] = await db.query(query, values);

 if (result.affectedRows === 0) {
    return null;
 }

  const updatedEvent = await getEventById(id);
  return updatedEvent;
};

// DELETE functions

// Delete Event function (DELETE)
export const deleteEvent = async (id) => {
  const [result] = await db.query(
    `DELETE FROM events WHERE event_id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};
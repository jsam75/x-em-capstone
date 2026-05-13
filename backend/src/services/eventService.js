import { db } from "../config/db.js";
import { groupEvents } from "../utils/groupEvents.js";
import { normalizeSorting } from "../utils/normalizeSorting.js";


//---------------
// GET functions
//---------------

export const getAllEvents = async (filters = {}) => {
  const {  
    city, 
    subject,
    startDate,
    endDate, 
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

 
  // Optional filters
  if (city) {
    conditions.push("LOWER(v.city) = LOWER(?)");
    values.push(city);
  }

  if (startDate) {
  conditions.push("e.starts_at >= ?");
  values.push(startDate);
}

if (endDate) {
  conditions.push("DATE(e.starts_at) <= ?");
  values.push(endDate);
}

if (subject) {
  const subjects = subject
    .split(",")
    .map(s => s.trim().toLowerCase());

  const placeholders = subjects.map(() => "?").join(", ");

 conditions.push(`
  e.event_id IN (
    SELECT es.event_id
    FROM event_subjects es
    JOIN subjects s ON es.subject_id = s.subject_id
    WHERE s.name IN (${placeholders})
  )
`);

values.push(...subjects);

}

conditions.push(`e.starts_at >= CURRENT_DATE`);
 
// Keep last - this combines above conditions into a single clause (or empty string if no filters)
  const filterClause = conditions.length
    ? conditions.join(" AND ")
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
    ${filterClause ? `WHERE ${filterClause}` : ""}
  `;

  const [countRows] = await db.query(countQuery, values);

  const total = countRows?.[0]?.total || 0;


  // -----------------------------------
  //  SELECTION PHASE (Paginated IDs)
  // -----------------------------------
  const idQuery = `
  SELECT e.event_id, e.starts_at, e.name
  FROM events e
  LEFT JOIN venues v ON e.venue_id = v.venue_id
  ${filterClause ? `WHERE ${filterClause}` : ""}
  GROUP BY e.event_id
  ORDER BY e.${safeSortBy} ${safeSortOrder}, e.event_id ASC
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
  ${filterClause ? `AND ${filterClause}` : ""}
  ORDER BY e.${safeSortBy} ${safeSortOrder}, e.event_id ASC
  `;


// Execute ONLY this query
const queryValues = [...eventIds, ...values];
const [eventRows] = await db.query(dataQuery, queryValues);


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

//---------------------------------------------------------
// Separate retrieval models for display vs edit workflows
//---------------------------------------------------------

// Get single event by ID (GET)
export const getEventById = async (id) => {
  const query = (`
    SELECT
      e.event_id,
      e.name,
      e.starts_at,
      e.ends_at,
      e.organization_id,
      e.venue_id,
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
    ORDER BY s.name ASC
  `);

    const [rows] = await db.query(query, [id]);

    if (!rows.length) return null;

    return groupEvents(rows)[0];
};

// GET a single event to edit
 export const getEventForEdit = async (id) => {
  const query = (`
    SELECT
      e.event_id,
      e.name,
      e.starts_at,
      e.ends_at,
      e.organization_id,
      e.venue_id,
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
    ORDER BY s.name ASC
  `);

    const [rows] = await db.query(query, [id]);

    if (!rows.length) return null;

    const row = rows[0];

  return {
    id: row.event_id,
    name: row.name,
    description: row.description,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    organization_id: row.organization_id,
    venue_id: row.venue_id,
    is_published: Boolean(row.is_published),
    subjectTags: rows
      .filter(r => r.subject_name)
      .map(r => r.subject_name)
};
};

// Get all subjects for filtering (GET)
export async function getAllSubjects() {
  const [rows] = await db.query(`
    SELECT name
    FROM subjects 
    ORDER BY name ASC;
  `);

  return rows;
}

//------------------
// CREATE functions 
//------------------

// Create Event request function (POST)
export const createEvent = async (eventData) => {    
  const {
    name,
    description,
    starts_at,
    ends_at,
    organization_id,
    venue_id,
    is_published = 0,
    subjectTags = []
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

  const eventId = result.insertId;

  if (subjectTags.length > 0) {
  //  dedupe
  const uniqueTags = [...new Set(subjectTags)];

  //  get subject_ids
  const [subjectRows] = await db.query(
    `
    SELECT subject_id, name
    FROM subjects
    WHERE name IN (?)
    `,
    [uniqueTags]
  );

  //  insert into join table
  for (const subject of subjectRows) {
    await db.query(
      `
      INSERT INTO event_subjects (event_id, subject_id)
      VALUES (?, ?)
      `,
      [eventId, subject.subject_id]
    );
  }
}

  return {
    event_id: result.insertId,
    ...eventData,
    is_published: is_published ? 1 : 0
  };
};


//Be able to select organization for dropdown
export async function getAllOrganizations() {
  const [rows] = await db.query(`
    SELECT organization_id, name
    FROM organizations
    ORDER BY name ASC
  `);

  return rows;
}

//Be able to select venues (city)
export const getAllVenues = async () => {
  const query = `
    SELECT venue_id, city, state
    FROM venues
    ORDER BY city ASC
  `;

  const [rows] = await db.query(query);

  return rows;
};

//-------------------
// UPDATE functions
//-------------------

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

 // Subject Tags - For Editing (PUT/PATCH)
 if (updates.subjectTags) {
  await db.query(
  `
    DELETE FROM event_subjects
    WHERE event_id = ?
    `,
    [id]
 )};

 for (const subjectName of updates.subjectTags) {
  const [subjectRows] = await db.query(
  `
    SELECT subject_id
    FROM subjects
    WHERE name = ?
    `, 
    [subjectName]
  );

   if (!subjectRows.length) continue;

    const subjectId = subjectRows[0].subject_id;

    await db.query(
    `
    INSERT INTO event_subjects
    (event_id, subject_id)
    VALUES (?, ?)
  `,
  [id, subjectId]
 );
}


  const updatedEvent = await getEventById(id);

  return updatedEvent;
};

//-------------------
// DELETE functions
//-------------------

// Delete Event function (DELETE)
export const deleteEvent = async (id) => {
  const [result] = await db.query(
    `DELETE FROM events WHERE event_id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};
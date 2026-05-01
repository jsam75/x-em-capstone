import { db } from "../config/db.js";


// GET functions

// Get All events with optional filters + pagination (GET)
export const getAllEvents = async (filters = {}) => {
  const { published, city, subject, limit, offset } = filters;

  // Parse pagination
  const limitVal = limit ? parseInt(limit) : 10;
  const offsetVal = offset ? parseInt(offset) : 0;

  // Build conditions
  const conditions = [];
  const values = [];

  // Filtering logic
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

  // COUNT query
  const countQuery = `
    SELECT COUNT(DISTINCT e.event_id) AS totalCount
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.venue_id
    LEFT JOIN event_subjects es ON e.event_id = es.event_id
    LEFT JOIN subjects s ON es.subject_id = s.subject_id
    ${whereClause}
  `;

  const [countResult] = await db.query(countQuery, values);
  const totalCount = countResult[0].totalCount;

  // ID query (pagination)
  let idQuery = `
    SELECT DISTINCT e.event_id
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.venue_id
    LEFT JOIN event_subjects es ON e.event_id = es.event_id
    LEFT JOIN subjects s ON es.subject_id = s.subject_id
    ${whereClause}
    ORDER BY e.event_id
    LIMIT ? OFFSET ?
  `;

  const idParams = [...values, limitVal, offsetVal];

  const [idRows] = await db.query(idQuery, idParams);

  if (!idRows.length) {
    return { eventsRows: [], totalCount };
  }

  // Extract IDs
  const eventIds = idRows.map(r => r.event_id);

  // Fetch full data
  const placeholders = eventIds.map(() => "?").join(", ");

  const dataQuery = `
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
    WHERE e.event_id IN (${placeholders})
    ORDER BY e.event_id
  `;

  const [eventsRows] = await db.query(dataQuery, eventIds);

  return {
    eventsRows,
    totalCount
  };
};


// Get single event by ID (GET)
export const getEventById = async (id) => {
  const [rows] = await db.query(`
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
  `, [id]);

  return rows;
};

export async function getAllSubjects() {
  const [rows] = await db.query(`
    SELECT DISTINCT s.name AS name
    FROM subjects s
    ORDER BY s.name
  `);

  return { rows, total  };
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
  const fields = [];
  const values = [];

  for (let key in updates) {
    fields.push(`${key} = ?`);

    if (key === "is_published") {
      values.push(updates[key] ? 1 : 0);
    } else {
      values.push(updates[key]);
    }
  }

  if (!fields.length) return null;

  const query = `
    UPDATE events
    SET ${fields.join(", ")}
    WHERE event_id = ?
  `;

  values.push(id);

  const [result] = await db.query(query, values);

  if (result.affectedRows === 0) return null;

  
  const updatedRows = await getEventById(id);
  return updatedRows;
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
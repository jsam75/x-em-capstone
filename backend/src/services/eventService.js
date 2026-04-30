import { db } from "../config/db.js";
console.log("🔥 SERVICE MAPPING RUNNING");


export const getAllEvents = async (filters = {}) => {
  const { published, city, subject, limit, offset } = filters;

  const conditions = [];
  const values = [];

  const limitVal = limit ? parseInt(limit) : null;
  const offsetVal = offset ? parseInt(offset) : null;

  if (published !== undefined) {
    conditions.push("e.is_published = ?");
    values.push(published === "true" ? 1 : 0);
  }

  if (city) {
    conditions.push("LOWER(v.city) = LOWER(?)");
    values.push(filters.city);
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

  let query = `
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
        e.description AS description,
        s.name AS subject_name
    FROM events e
    LEFT JOIN venues v ON e.venue_id = v.venue_id
    LEFT JOIN ticket_types t ON e.event_id = t.event_id
    LEFT JOIN organizations o ON e.organization_id = o.organization_id
    LEFT JOIN event_subjects es ON e.event_id = es.event_id
    LEFT JOIN subjects s ON es.subject_id = s.subject_id
    ${whereClause}
  `;

  const queryParams = [...values];

  if (limitVal) {
    query += " LIMIT ?";
    queryParams.push(limitVal);
  }

  if (offsetVal) {
    query += " OFFSET ?";
    queryParams.push(offsetVal);
  }

  const [rows] = await db.query(query, queryParams);

  console.log("DB ROWS:", rows);
  console.log("FILTERS:", filters);

  return rows;
};

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

  return rows;
}
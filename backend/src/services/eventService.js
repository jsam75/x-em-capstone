/**
 * eventService.js
 *
 * Purpose:
 * Handles all database interactions related to events.
 * Acts as the data access layer — executes queries and returns results.
 *
 * Notes:
 * - No HTTP logic (no req/res)
 * - No response formatting
 * - Keeps database logic isolated from controllers
 * 
 * Controller = "What do we send back"?
 * Service = "How do we get the data"?
 * Database = "Where the data lives"?
 * Routes = "Which endpoint is this"?
 * 
 * Put DB logic in here
 */

import { db } from "../config/db.js";

export const getAllEvents = async () => {
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
        o.name AS organizer_name
    FROM events e
    LEFT JOIN venues v 
        ON e.venue_id = v.venue_id
    LEFT JOIN ticket_types t
        ON e.event_id = t.event_id
    LEFT JOIN organizations o
        ON e.organization_id = o.organization_id
    `);
    return rows;};
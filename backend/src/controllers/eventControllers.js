/**
 * eventController.js
 *
 * Purpose:
 * Handles HTTP requests and responses for event-related routes.
 * Calls service functions to get data and sends structured responses to the client.
 *
 * Notes:
 * - Contains req/res logic (status codes, JSON responses)
 * - Does NOT interact with the database directly
 * - Keeps HTTP layer separate from business/data logic
 * 
 * Controller = "What do we send back"?
 * Service = "How do we get the data"?
 * Database = "Where the data lives"
 * Routes = "Which endpoint is this"?
 * 
 * Controller will shape the data to be frontend friendly.
 */

import { getAllEvents } from "../services/eventService.js";

// Helper function to convert datetime to date-only string, useful for when more
// data is added to the event object and we want to keep the date human readable.
const toDateOnly = (value) => {
    return new Date(value).toISOString().split("T")[0];
}

export const fetchEvents = async (req, res) => {
  try {
    const events = await getAllEvents();

    // Transform database rows into frontend-friendly format
    const formattedEvents = events.map((event) => ({
      id: event.event_id,
      title: event.name,
      date: event.starts_at ? toDateOnly(event.starts_at) : null,
      location: event.city && event.state
      ? `${event.city}, ${event.state}`
      : null,
      city: event.city || null,
      state: event.state || null,
      price: event.price_cents ? event.price_cents / 100 : null,
      capacity: event.capacity || null,
      organizerName: event.organizer_name || null,
      published: Boolean(event.is_published),
    }));

    console.log(Object.keys(events[0]));

    res.json({
    success: true,
    data: formattedEvents  
});

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (err) {
    console.error("Error fetching events:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
import { getAllEvents, getEventById as getEventByIdService } from "../services/eventService.js";
import { groupEvents } from "../utils/groupEvents.js";
import * as eventService from "../services/eventService.js";
import { parsePagination, buildPaginationMeta } from "../utils/pagination.js";

// GET request functions

// Get all events with pagination 
export const fetchEvents = async (req, res) => {
  try {   
   const { published, city, subject } = req.query;

    // Pagination Extracted Logic
    const { limit, offset } = parsePagination(req.query);

    const { eventsRows, totalCount } = await getAllEvents({
      published,
      city,
      subject,
      limit,
      offset
    });

    const formattedEvents = groupEvents(eventsRows);

    res.json({
      success: true,
      data: formattedEvents,
      meta: buildPaginationMeta({
        total: totalCount,
        limit,
        offset
      })
    });

  } catch (err) {
    console.error("Error fetching events:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await getEventByIdService(id);
    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    const formattedEvent = groupEvents(rows)[0];
    
      res.json({
      success: true,
      data: formattedEvent
    });

  } catch (err) {
    console.error("Error fetching event:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Get all subjects for filtering
export async function getAllSubjects(req, res) {
  try {
    const subjects = await eventService.getAllSubjects();
    res.json({ data: subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Create a new event (POST)
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      starts_at,
      ends_at,
      organization_id,
      venue_id,
      is_published
    } = req.body;

    // Basic validation
    if  (!name || !starts_at || !ends_at || !organization_id || !venue_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const newEvent = await eventService.createEvent({
      name,
      description,
      starts_at,
      ends_at,
      organization_id,
      venue_id,
      is_published
    });

    res.status(201).json({
      success: true,
      data: newEvent
    });

  } catch (err) {
    console.error("Error creating event:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update an existing event (PUT)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update"
      });
    }

    const updatedRows = await eventService.updateEvent(id, updates);

    if (!updatedRows || !updatedRows.length) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

     const grouped = groupEvents(updatedRows);

     if (!grouped.length) {
      return res.status(404).json({
       success: false,
       message: "Event not found after grouping"
     });
}

     const formattedEvent = grouped[0];

    res.json({
      success: true,
      data: formattedEvent
    });

  } catch (err) {
    console.error("Error updating event:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Delete an event (DELETE)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await eventService.deleteEvent(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (err) {
    console.error("Error deleting event:", err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
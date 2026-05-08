import { getAllEvents, getEventById as getEventByIdService } from "../services/eventService.js";
import * as eventService from "../services/eventService.js";
import { parsePagination } from "../utils/pagination.js";


// GET request functions

// Get all events with pagination 
export const fetchEvents = async (req, res, next) => {
  try {   
   const { city, startDate, endDate, subject, sortBy, sortOrder } = req.query;

    // Pagination Extracted Logic
    const { limit, offset } = parsePagination(req.query);

    const result = await getAllEvents({
      city,
      startDate,
      endDate,
      subject,
      limit,
      offset,
      sortBy,
      sortOrder
    });


console.log("Controller params:", { startDate, endDate });

  res.json({
      success: true,
      data: result.data,
      meta: result.pagination
    });

  } catch (err) {
    next (err);
  }
};

// Get single event by ID
export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await getEventByIdService(id);

     if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      data: event
    });

  } catch (err) {
    next (err);
 }
};

// Get all subjects for filtering
export async function getAllSubjects(req, res, next) {
  try {
    const subjects = await eventService.getAllSubjects();
    res.json({ success: true, data: subjects });
  } catch (err) {
    next (err);
  };
}

// Create a new event (POST)
export const createEvent = async (req, res, next) => {
  try {
    const {
      name,
      description,
      starts_at,
      ends_at,
      organization_id,
      venue_id,
      is_published,
      subjectTags
    } = req.body;

    const newEvent = await eventService.createEvent({
      name,
      description,
      starts_at,
      ends_at,
      organization_id,
      venue_id,
      is_published,
      subjectTags
    });

    res.status(201).json({
      success: true,
      data: newEvent
    });

  } catch (err) {
    next (err);
  }
};

// Shared HTTP request functions: GET, POST, PUT

// Organizations
export const getAllOrganizations = async (req, res, next) => {
  try {
    const orgs = await eventService.getAllOrganizations();

    res.json({
      success: true,
      data: orgs
    });
  } catch (err) {
    next(err);
  }
};

// Venues
export const getAllVenues = async (req, res, next) => {

  try {
    const venues = await eventService.getAllVenues();

    res.json({
      success: true,
      data: venues
    });

  } catch (err) {
    next(err);
  }
};

// Update an existing event (PUT) - behaves like PATCH
export const updateEvent = async (req, res, next) => { 
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedEvent = await eventService.updateEvent(id, updates);

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.json({
      success: true,
      data: updatedEvent
    });

  } catch (err) {
    next(err);
  }
};

// Delete an event (DELETE)
export const deleteEvent = async (req, res, next) => {
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
    next (err);
     }
};
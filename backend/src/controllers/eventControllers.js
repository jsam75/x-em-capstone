import { getAllEvents, getEventById as getEventByIdService } from "../services/eventService.js";
import { groupEvents } from "../utils/groupEvents.js";

// Get all events with optional filters
export const fetchEvents = async (req, res) => {
  try {   
    const { published, city, subject, limit, offset } = req.query;

    const events = await getAllEvents({ published, city, subject, limit, offset });

    const formattedEvents = groupEvents(events);

    res.json({
    success: true,
    data: formattedEvents  
});

     } catch (err) {
    console.error("Error fetching events:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
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
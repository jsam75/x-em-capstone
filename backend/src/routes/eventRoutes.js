// Routes for Events - still holds subjects, but will evolve to be more event-focused
import express from "express";
import { 
    fetchEvents, 
    getEventById, 
    getAllSubjects,
    createEvent,
    getAllOrganizations,
    getAllVenues,
    updateEvent,
    deleteEvent 
} from "../controllers/eventControllers.js";
import { validateEvent } from "../middleware/validateEvent.js";

const router = express.Router();

// Static Route
router.get("/", fetchEvents);
router.post("/", validateEvent(false), createEvent);

router.get("/subjects", getAllSubjects);
router.get("/organizations", getAllOrganizations);
router.get("/venues", getAllVenues);

// Dynamic Route
router.get("/:id", getEventById);
//router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.put("/:id", validateEvent(true), updateEvent);

export default router;
// Routes for Events - still holds subjects, but will evolve to be more event-focused
import express from "express";
import { 
    fetchEvents, 
    getEventById, 
    getAllSubjects 
} from "../controllers/eventControllers.js";
const router = express.Router();

// Static Route
router.get("/", fetchEvents);
router.get("/subjects", getAllSubjects);

// Dynamic Route
router.get("/:id", getEventById);

export default router;
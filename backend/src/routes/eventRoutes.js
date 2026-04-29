import express from "express";
import { fetchEvents, getEventById } from "../controllers/eventControllers.js";

const router = express.Router();

// Static Route
router.get("/", fetchEvents);

// Dynamic Route
router.get("/:id", getEventById);

export default router;
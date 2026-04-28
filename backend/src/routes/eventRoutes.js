/**
 * eventRoutes.js
 *
 * Purpose:
 * Defines API endpoints for event-related operations and maps them to controller functions.
 *
 * Notes:
 * - Connects URL paths to controller handlers
 * - No business logic or database logic
 * - Keeps routing structure organized and modular
 * 
 * Routes = "Which endpoint is this"?
 * Controller = "What do we send back"?
 * Service = "How do we get the data"?
 * Database = "Where the data lives"
 */

import express from "express";
import { fetchEvents } from "../controllers/eventControllers.js";

const router = express.Router();

router.get("/", fetchEvents);

export default router;
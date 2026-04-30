// Route Aggregator - Centralizes all route definitions
import express from "express";
import eventRoutes from "./eventRoutes.js";
import subjectRoutes from "./subjectRoutes.js";

const router = express.Router();

// Mount sub-routers
router.use("/events", eventRoutes);
router.use("/subjects", subjectRoutes);

export default router;
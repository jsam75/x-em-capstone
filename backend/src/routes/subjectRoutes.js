// Subject- related routes
// Kept lightweight for Phase 1 architecture

import express from "express";
import { getAllSubjects } from "../controllers/eventControllers.js";

const router = express.Router();

router.get("/", getAllSubjects);

export default router;
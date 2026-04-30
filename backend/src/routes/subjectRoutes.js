// Routes for Subjects
import express from "express";
import { getAllSubjects } from "../controllers/eventControllers.js";

const router = express.Router();

router.get("/", getAllSubjects);

export default router;
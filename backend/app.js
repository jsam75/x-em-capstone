import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

import { db } from "./src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "./public");

// Serve static frontend files
  app.use(express.static(frontendPath));

// React Router fallback
  app.get("*splat", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Temporary DB route for production debugging
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS test");

    res.json({
      success: true,
      rows
    });
  } catch (err) {
    console.error("DB TEST ERROR:", err);

    res.status(500).json({
      success: false,
      errorName: err?.name,
      errorMessage: err?.message,
      errorCode: err?.code,
      fullError: String(err)
    });
  }
});

// Error middleware
app.use(errorHandler); // MUST be last middleware 


export default app;
import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

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

// Error middleware
app.use(errorHandler); // MUST be last middleware 


export default app;
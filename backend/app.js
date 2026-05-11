import express from "express";
import cors from "cors";

import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";


const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// Basic health check of the root route
app.get("/", (req, res) => {
  res.send("X_EM API is running");
});

// Error middleware
app.use(errorHandler); // MUST be last middleware 


export default app;
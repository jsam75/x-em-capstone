import express from "express";
import cors from "cors";

import { db } from "./src/config/db.js";
import eventRoutes from "./src/routes/eventRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);


app.get("/", (req, res) => {
  res.send("X_EM API is running");
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB connection failed");
  }
});

export default app;
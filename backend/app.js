import express from "express";
import cors from "cors";

import { db } from "./src/config/db.js";
import routes from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/errorHandler.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.use(errorHandler); // MUST be last middleware 



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
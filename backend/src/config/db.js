import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
 
});

// Production Debugging 
console.log("DB CONFIG:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

db.getConnection()
  .then(() => console.log("DB CONNECTION SUCCESS"))
  .catch(err => {
    console.error("DB CONNECTION FAILURE");
    console.error(err);
  });
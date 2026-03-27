import express from "express";
import dotenv from "dotenv";
import morgan from "morgan"
import app from "./app.js";
import db_conn from "./config/db.js";
import logger from "./utils/logger.js";
dotenv.config();
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    },
  }),
);db_conn(); 
const PORT=process.env.PORT || 8080;
app.listen(PORT,()=>{
logger.info(` Server running at PORT ${PORT}`)
})
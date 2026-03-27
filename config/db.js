import mongoose from "mongoose";
import logger from "../utils/logger.js";

const db_conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGO DB connected successfully");
  } catch (err) { logger.error(` Error connecting database ${err.message}`)
logger.error(` Error connecting Database ${err.message}`)
}
};
export default db_conn;

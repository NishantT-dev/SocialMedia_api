import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) { logger.error(` JWT error ${err.message}`)
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

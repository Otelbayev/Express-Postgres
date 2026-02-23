import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token field" });
    }

    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    const user = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [decoded.id],
    );

    if (user.rows[0].length === 0) {
      return res.status(401).json({ message: "Not authorized, token field" });
    }

    req.user = user.rows[0];
    next();
  } catch (e) {
    res.status(401).json({ message: "Not authorized, token field" });
  }
};

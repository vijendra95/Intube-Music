const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "intubemedia-secret-key-change-in-production";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization") || "";
    const xAuthToken = req.header("X-Auth-Token") || "";
    const token = xAuthToken || (authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : "");
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admin only." });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ error: "Forbidden." });
  }
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { auth, adminAuth, generateToken };

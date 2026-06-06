const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getJwtSecret } = require("../utils/jwtSecret");

/*
========================
PROTECT ROUTES (JWT AUTH)
========================
*/
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or deleted",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}`,
      });
    }

    // attach user
    req.user = user;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

/*
========================
ROLE AUTHORIZATION (RBAC)
========================
*/
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not loaded",
      });
    }

    const userRole = req.user.role?.toLowerCase();

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "User role missing",
      });
    }

    if (!roles.map(r => r.toLowerCase()).includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${userRole}`,
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};
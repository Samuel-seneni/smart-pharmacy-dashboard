const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
========================
PUBLIC AUTH ROUTES
========================
*/

// Register new user (admin can later control this)
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

/*
========================
PROTECTED ROUTES
========================
*/

// Get logged-in user profile
router.get(
  "/profile",
  protect,
  getProfile
);

/*
========================
ADMIN ONLY (ENTERPRISE CONTROL)
========================
*/

// Example: future user management endpoint
router.get(
  "/users",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin user management endpoint ready"
    });
  }
);

module.exports = router;
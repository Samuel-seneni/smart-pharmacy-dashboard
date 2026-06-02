const express = require("express");

const {
  getAllUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} = require("../controllers/userController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
========================
ADMIN USER MANAGEMENT
========================
*/

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllUsers
);

/**
 * @route   POST /api/users
 * @desc    Create new staff user
 * @access  Admin
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  createUser
);

/**
 * @route   PUT /api/users/role/:id
 * @desc    Update user role
 * @access  Admin
 */
router.put(
  "/role/:id",
  protect,
  authorize("admin"),
  updateUserRole
);

/**
 * @route   PUT /api/users/status/:id
 * @desc    Activate / Suspend user
 * @access  Admin
 */
router.put(
  "/status/:id",
  protect,
  authorize("admin"),
  toggleUserStatus
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);

module.exports = router;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isSuperAdmin } = require("../utils/systemRoles");

/*
========================
GET ALL USERS
========================
*/
console.log("USER CONTROLLER LOADED");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      users,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
CREATE USER (ADMIN ONLY)
========================
*/

const createUser = async (req, res) => {
  try {

    const { name, email, password, role, phone } = req.body;

    const exists = await User.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
UPDATE ROLE
========================
*/

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🚨 BLOCK ROLE CHANGE FOR SUPER ADMIN
    if (isSuperAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: "Super Admin role cannot be changed",
      });
    }

    user.role = role;

    await user.save();

    res.json({
      success: true,
      message: "Role updated successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
TOGGLE STATUS
========================
*/

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🚨 BLOCK SUPER ADMIN STATUS CHANGE
    if (isSuperAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: "Super Admin status cannot be changed",
      });
    }

    user.status =
      user.status === "active" ? "suspended" : "active";

    await user.save();

    res.json({
      success: true,
      message: `User is now ${user.status}`,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
========================
DELETE USER
========================
*/

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🚨 BLOCK SUPER ADMIN DELETE
    if (isSuperAdmin(user)) {
      return res.status(403).json({
        success: false,
        message: "Super Admin account cannot be deleted",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
};
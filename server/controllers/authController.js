const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ✅ NEW: Activity Log model
const ActivityLog = require("../models/ActivityLog");

/*
========================
REGISTER USER
========================
*/
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await User.unscoped().findOne({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: role?.toLowerCase(),
      phone,
    });

    // 🧾 LOG REGISTER ACTION
    await ActivityLog.create({
      userId: user.id,
      name: user.name,
      role: user.role,
      action: "REGISTER",
      route: "/auth/register",
      method: "POST",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
      },
      token: generateToken(user.id, user.role),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
LOGIN USER
========================
*/
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.toLowerCase().trim();

    const user = await User.scope("withPassword").findOne({
      where: { email: cleanEmail },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status}`,
      });
    }

    // ✅ Update last login
    await user.update({
      lastLogin: new Date(),
    });

    const token = generateToken(user.id, user.role);

    // 🧾 LOG LOGIN ACTION
    await ActivityLog.create({
      userId: user.id,
      name: user.name,
      role: user.role,
      action: "LOGIN",
      route: "/auth/login",
      method: "POST",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================
GET PROFILE
========================
*/
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
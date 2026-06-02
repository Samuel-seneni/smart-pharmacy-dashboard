const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { sequelize } = require("../config/db");

const seedAdmin = async () => {
  try {
    await sequelize.sync();

    const existing = await User.findOne({
      where: { email: "admin@pharmacy.com" },
    });

    if (existing) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@pharmacy.com",
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("✅ Super Admin Created Successfully");

  } catch (error) {
    console.error(error);
  }
};

seedAdmin();
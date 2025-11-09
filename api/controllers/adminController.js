const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user"); // your user model
// Admin Login
require("dotenv").config();

exports.adminLogin = async (req, res) => {
  try {
    const { account_number, password } = req.body;

    // Find admin by account number
    const admin = await User.findOne({ where: { account_number, role: "admin" } });
    if (!admin) return res.status(401).json({ message: "Invalid admin credentials" });

    if (!admin.is_active) {
      return res.status(403).json({ message: "Admin account inactive. Contact system owner." });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: admin.id, role: admin.role, account_number: admin.account_number },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "✅ Admin login successful",
      accessToken: token,
      admin: {
        id: admin.id,
        name: admin.name,
        account_number: admin.account_number,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Dashboard Data
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const pendingKyc = await User.count({ where: { kyc_status: "pending" } });
    const approvedKyc = await User.count({ where: { kyc_status: "approved" } });

    res.json({
      message: "Admin dashboard data",
      stats: {
        totalUsers,
        pendingKyc,
        approvedKyc,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

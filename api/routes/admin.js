const express = require("express");
const router = express.Router();
const { adminLogin, getDashboard } = require("../controllers/adminController");
// const { authenticate } = require("../middleware/auth");
// const { checkRole } = require("../middleware/roles");

// Admin login route
router.post("/login", adminLogin);

// Protected routes (admin only)
// router.get("/dashboard", authenticate, checkRole("admin"), getDashboard);
module.exports = router;



const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getCurrentUser,
  refreshToken,
  logout,
  getDashboard,
} = require("../controllers/adminController");
const { register } = require("../controllers/userController");


router.post("/register", register);

module.exports = router;



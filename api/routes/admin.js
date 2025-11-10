const express = require("express");
const router = express.Router();
const { adminLogin, getDashboard ,logout, getCurrentUser} = require("../controllers/adminController");


// Admin login route
router.post("/login", adminLogin);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

module.exports = router;

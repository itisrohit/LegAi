const express = require("express");
const { logout } = require("../controllers/logoutController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/logout", authenticate, logout);

module.exports = router;

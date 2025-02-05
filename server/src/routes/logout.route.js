const express = require("express");
const { logout } = require("../controllers/logout.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/logout", authenticate, logout);

module.exports = router;

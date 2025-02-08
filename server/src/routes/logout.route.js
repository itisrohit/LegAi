const express = require("express");
const { logout } = require("../controllers/logout.controller");

const router = express.Router();

router.post("/logout", logout);

module.exports = router;

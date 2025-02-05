const express = require('express');
const { addMessageToChat } = require('../controllers/message.controller');

const router = express.Router();

// Route to add a new message to a chat (POST /api/v1/messages/:chatId)
router.post('/:chatId', addMessageToChat);

module.exports = router;

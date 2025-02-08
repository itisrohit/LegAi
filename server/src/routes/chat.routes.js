const express = require('express');
const { 
  createChat, 
  getChatsForUser, 
  getMessagesForChat, 
  deleteChat 
} = require('../controllers/chat.controller');

const router = express.Router();

// Route to create a new chat (POST /api/v1/chats/create)
router.post('/create', createChat);

// Route to get all chats for a user (GET /api/v1/chats/:userId)
router.get('/list', getChatsForUser);

// Route to get all messages for a chat (GET /api/v1/chats/messages/:chatId)
router.get('/messages/:chatId', getMessagesForChat);

// Route to delete a chat (DELETE /api/v1/chats/:chatId)
router.delete('/:chatId', deleteChat);

module.exports = router;

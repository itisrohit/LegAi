const { Message } = require("../models/message.model")
const { Chat } = require("../models/chat.model");

// Add a message (question and answer) to a chat

exports.addMessageToChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { query, answer } = req.body;

    if (!query || !answer) {
      return res.status(400).json({ message: "Both question and answer are required" });
    }

    // Create and save the new message document (linked to the chat)
    const newMessage = new Message({ chatId, query, answer });
    await newMessage.save();

    // Update the last updated timestamp for the chat
    await Chat.findByIdAndUpdate(chatId, { lastUpdated: Date.now() });

    res.status(201).json({ message: "Message added", messageId: newMessage._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

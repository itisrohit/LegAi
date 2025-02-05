const { Chat } = require("../models/chatModel");
const { Message } = require("../models/messageModel");

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { userId, title } = req.body;
    if (!userId || !title) {
      return res.status(400).json({ message: "User ID and title are required" });
    }

    const newChat = new Chat({ userId, title });
    await newChat.save();

    res.status(201).json({ message: "Chat created successfully", newChat });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in createChat:", error);
  }
};

// Get all chats for a user
exports.getChatsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ userId }).sort({ lastUpdated: -1 });

    const formattedChats = chats.map(chat => ({
      chatId: chat._id,
      title: chat.title,
      lastUpdated: chat.lastUpdated.toLocaleString(),
    }));

    res.status(200).json(formattedChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in getChatsForUser:", error);
  }
};

// Get all messages for a chat
exports.getMessagesForChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in getMessagesForChat:", error);
  }
};



// Delete a chat and its messages
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    await Message.deleteMany({ chatId });
    const deletedChat = await Chat.findByIdAndDelete(chatId);
    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error in deleteChat:", error);
  }
};

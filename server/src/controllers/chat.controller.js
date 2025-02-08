const { Chat } = require("../models/chat.model");
const { Message } = require("../models/message.model");

// Create a new chat (when user clicks the "+" and provides a title)
exports.createChat = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id; // Assuming user is authenticated and userId is in the request

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newChat = new Chat({ userId, title });
    await newChat.save();

    res.status(201).json({ message: "Chat created successfully", newChat });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("error in createChat:", error);
  }
};


// Get all chats for a given user (for sidebar display)
// Get all chats for the authenticated user (no need for userId in the route)
exports.getChatsForUser = async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from authenticated user
    const chats = await Chat.find({ userId }).sort({ lastUpdated: -1 });

    // Optional: format timestamps for display
    const formattedChats = chats.map(chat => ({
      chatId: chat._id,
      title: chat.title,
      lastUpdated: chat.lastUpdated.toLocaleString(),
    }));

    res.status(200).json(formattedChats);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("error in getChatsForUser:", error);
  }
};


// Get all messages for a particular chat (to display full chat history)
exports.getMessagesForChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    // Retrieve messages sorted in ascending order (oldest first)
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("error in getMessagesForChat:", error);
  }
};

// Delete a chat and all of its messages
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Delete all messages for this chat first
    await Message.deleteMany({ chatId });

    // Then delete the chat itself
    const deletedChat = await Chat.findByIdAndDelete(chatId);
    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("error in deleteChat:", error);
  }
};

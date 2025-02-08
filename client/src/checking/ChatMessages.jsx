import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';


function ChatMessages() {
  const navigate = useNavigate();
  const { chatId } = useParams(); // Get chatId from URL
  const [messages, setMessages] = useState([]);
  const accessToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('accessToken='));

  useEffect(() => {
    const fetchMessages = async () => {
      if (!accessToken) {
        alert('Access Token not found!');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/chats/messages/${chatId}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId, accessToken]);

  const deleteChat = async () => {
    if (!accessToken) {
      alert("Access Token not found!");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/v1/chats/${chatId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("Chat deleted successfully!");
      navigate("/chats"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };

  return (
    <div>
      <h1>Chat Messages</h1>
      <button onClick={deleteChat}>🗑️ Delete Chat</button>
      <ul>
        {messages.map(message => (
          <li key={message.chatId}>
            <p>{message.query}</p>
            <p>{message.answer}</p>
            <span>{new Date(message.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatMessages;

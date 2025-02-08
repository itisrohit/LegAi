import { useEffect, useState } from 'react';
import axios from 'axios';

function ChatList() {
  const [chats, setChats] = useState([]);
  const accessToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('accessToken='));

  useEffect(() => {
    const fetchChats = async () => {
      if (!accessToken) {
        alert("Access Token not found!");
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/v1/chats/list", {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        console.log("Fetched chats:", response.data);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [accessToken]);

  return (
    <div>
      <h1>Chats</h1>
      <ul>
        {chats.map(chat => (
          
          <li key={chat.chatId}>
            <a href={`/messages/${chat.chatId}`}>{chat.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;

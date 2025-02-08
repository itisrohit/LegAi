import { useState, useEffect } from "react";
import axios from "axios";

const SidePanelOpen = () => {
  const [chats, setChats] = useState([]);
  const accessToken = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("accessToken="));

  useEffect(() => {
    const fetchChats = async () => {
      if (!accessToken) {
        alert("Access Token not found!");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/chats/list",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log("Fetched chats:", response.data);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [accessToken]);

  return (
    <div className="w-1/4 absolute border h-full text-3xl px-2">
      <div className="upperDiv flex flex-col space-y-4 items-start w-full">
        <button className="m-3">
          <ion-icon name="menu-outline"></ion-icon>
        </button>
        <hr />
        <div className="text-xl rounded-md border w-full p-2 flex justify-between">
          <p>Chat</p>
          <button>
            <ion-icon name="trash"></ion-icon>
          </button>
        </div>
      </div>

      <ul>
        {chats.map((chat) => (
          <li key={chat.chatId}>
            <a href={`/messages/${chat.chatId}`}>{chat.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidePanelOpen;

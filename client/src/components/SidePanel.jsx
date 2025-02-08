import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../src/App.css";

const SidePanel = () => {
  // const [isOpen, setIsOpen] = useState(true)
    const navigate = useNavigate();
  const { chatId } = useParams();
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
      navigate("/chat"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat");
    }
  };
  return (
    <>
      {
        <div className="side-panel w-1/4 absolute h-full text-3xl px-2">
          <div className="upperDiv flex flex-col space-y-4 items-start w-full">
            <button>
              <ion-icon name="add-outline"></ion-icon>
            </button>
            <div className="text-xl rounded-md w-full p-2 flex justify-between">
              <ul className="w-full">
                {chats.map((chat) => (
                  <li key={chat.chatId} className="flex justify-between w-full p-2 border rounded-md mb-2">
                    <Link to={`/messages/${chat.chatId}`}><p>{chat.title}</p></Link>
                    <button onClick={deleteChat}>
                        <ion-icon name="trash"></ion-icon>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default SidePanel;

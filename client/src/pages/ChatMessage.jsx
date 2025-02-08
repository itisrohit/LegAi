import ChatContainer from '../components/ChatContainer'
import InputForm from '../components/InputForm'
import SidePanel from '../components/SidePanel'

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatMessage = () => {

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

 

  return (
    <div className='chat-page relative w-full h-screen overflow-hidden'>
      <SidePanel/>
      <ChatContainer/>
      
    </div>
  )
}

export default ChatMessage

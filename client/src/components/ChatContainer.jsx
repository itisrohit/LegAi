import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import SentMessage from './SentMessage'
import AiMsg from './AiMsg'
import InputForm from './InputForm'

const ChatContainer = () => {
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

  const handleUserInput = (userQuery) => {
    const predefinedResponses = {
      "What is an IPC": "Cognizable offenses such as murder or rape allow the police to register an FIR and take immediate action, whereas non-cognizable offenses (like defamation or simple assault) do not require an FIR and usually lead to a police inquiry only after obtaining court permission.",
    };

    const response = predefinedResponses[userQuery] || "Good afternoon! Hmm, I’m not sure about general of , but I’m always here to help anything regarding to legal quieries! Maybe try asking in a different way?";

    const newMessage = {
      chatId: messages.length + 1,
      query: userQuery,
      answer: response,
      timestamp: Date.now(),
    };

    setMessages([...messages, newMessage]);

    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.map(msg =>
        msg.chatId === newMessage.chatId ? { ...msg, answer: response } : msg
      ));
    }, 5000); // Simulate response delay
  };

  return (
    <>
    
      <div className='absolute ml-100 mt-30 rounded-md w-2/3 h-1/2 overflow-y-auto'>
        <ul>
          {messages.map(message => (
            <li key={message.chatId}>
              <p>{<SentMessage data={message.query}/>}</p>
              <p>{<AiMsg data={message.answer}/>}</p>
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
        <InputForm onSendMessage={handleUserInput} />
    </>
  )
}

export default ChatContainer
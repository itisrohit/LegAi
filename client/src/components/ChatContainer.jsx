import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SentMessage from './SentMessage';
import AiMsg from './AiMsg';
import { useDispatch } from 'react-redux';
import { saveMessageToBackend } from '../redux/chatSlice'; 
import InputForm from './InputForm';

const ChatContainer = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  // Extract accessToken properly
  const accessToken = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('accessToken='))
    ?.split('=')[1];

  useEffect(() => {
    const fetchMessages = async () => {
      if (!accessToken) {
        alert('Access Token not found!');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/chats/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]); 

  const handleUserInput = async (question) => {
    if (!accessToken) {
      alert('Access Token not found!');
      return;
    }
  
    // Show user's question immediately
    setMessages(prevMessages => [
      ...prevMessages,
      { query: question, answer: null, timestamp: new Date().toISOString() }
    ]);
  
    try {
      // Show "Typing..." indicator
      setMessages(prevMessages => [
        ...prevMessages,
        { query: null, answer: "Typing...", timestamp: new Date().toISOString() }
      ]);
  
      // Request answer from bot
      const response = await axios.post('http://localhost:3000/query', { query: question }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const botAnswer = response.data.answer;
  
      // If the bot didn't give an answer, show an error and exit
      if (!botAnswer) {
        setMessages(prevMessages => [
          ...prevMessages.filter(msg => msg.answer !== "Typing..."),
          { query: null, answer: "Sorry, I couldn't process your request. Please try again later.", timestamp: new Date().toISOString() }
        ]);
        return;
      }
  
      // Remove "Typing..." and add bot response
      setMessages(prevMessages => [
        ...prevMessages.filter(msg => msg.answer !== "Typing..."),
        { query: null, answer: botAnswer, timestamp: new Date().toISOString() }
      ]);
  
      // Save only successful responses to Redux
      dispatch(saveMessageToBackend(chatId, question, botAnswer));
  
      // Save only successful responses to the database
      await axios.post(`http://localhost:8080/api/v1/messages/${chatId}`, { query: question, answer: botAnswer }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
    } catch (error) {
      console.error('Error sending message:', error);
  
      // Remove "Typing..." and show error message
      setMessages(prevMessages => [
        ...prevMessages.filter(msg => msg.answer !== "Typing..."),
        { query: null, answer: "Sorry, I couldn't process your request. Please type your query again", timestamp: new Date().toISOString() }
      ]);
    }
  };

  return (
    <>
      <div className='absolute ml-100 mt-30 rounded-md w-2/3 h-1/2 overflow-y-auto'>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.query && <SentMessage data={message.query} />}
              {message.answer && <AiMsg data={message.answer} />}
              <span>{new Date(message.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <InputForm onSendMessage={handleUserInput} />
    </>
  );
};

export default ChatContainer;

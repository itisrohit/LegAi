import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { saveMessageToBackend } from '../redux/chatSlice'; // Action to save message
import { useParams } from 'react-router-dom';

// Combined function to handle question-answer process and component
export default function AskQuestionComponent() {
  const { chatId } = useParams(); // Get chatId from URL
  const accessToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('accessToken='));
  const [question, setQuestion] = useState('');
  const dispatch = useDispatch(); // Get dispatch function from Redux

  const askQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }

    try {
      // Step 1: Get the answer from the bot
      const response = await axios.post('http://localhost:3000/query', { query: question }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const answer = response.data.answer;

      // Step 2: Update Redux with the question-answer pair
      dispatch(saveMessageToBackend(chatId, question, answer));

      // Step 3: Send the question-answer pair to the backend for storage
      const final =await axios.post(`http://localhost:8080/api/v1/messages/${chatId}`, { query: question, answer }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Final response:", final);

      console.log("Question and answer saved successfully!");
    } catch (error) {
      console.log("Error during question/answer process:", error);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
        placeholder="Ask a question" 
      />
      <button onClick={askQuestion}>Ask</button>
    </div>
  );
}

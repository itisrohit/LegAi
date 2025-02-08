import { useState } from 'react';
import axios from 'axios';

function Form() {
  const [title, setTitle] = useState('');
  const accessToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('accessToken='));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert('Please provide a title');
      return;
    }


    if (!accessToken) {
      alert('Access Token not found!');
      return;
    }


    try {
      // Send POST request to create a new chat
      const response = await axios.post(
        'http://localhost:8080/api/v1/chats/create',
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,  // Send the access token as a Bearer token
          },
        }
      );

      // Handle success
      console.log('Chat created:', response.data);
      alert('Chat created successfully');
      setTitle(''); // Reset title after successful submission
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Error creating chat');
    }
  };

  const writeSaveTitle = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={writeSaveTitle}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;

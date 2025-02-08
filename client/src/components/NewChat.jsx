import React,{useState} from 'react'
import '../../src/App.css'
import axios from 'axios'

const NewChat = () => {

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
      <form action="/" className='absolute rounded border w-1/3 ml-140 mt-140 flex items-center'>
              <input type="text" className='h-10 w-full overflow-y-auto p-2' maxLength={1000} placeholder='Give a title...' value={title} onChange={writeSaveTitle}/>
              <button className='text-3xl m-2 flex items-center'><ion-icon name="send" onClick={handleSubmit}></ion-icon></button>
      </form>
    )
}

export default NewChat
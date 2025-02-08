import React from 'react'
import '../../src/App.css'
import SidePanel from '../components/SidePanel'
import InputForm from '../components/InputForm'
import NewChat from '../components/NewChat'
import BasicChat from '../components/BasicChat'
import ChatContainer from '../components/ChatContainer'

const Chat = () => {
  return (
    <div className='chat-page relative w-full h-screen overflow-hidden bg-[url()]'>
        <SidePanel/>
        <BasicChat/>
        <NewChat/>
    </div>
  )
}

export default Chat
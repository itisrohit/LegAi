import React,{useState} from 'react'
import '../../src/App.css'

const NewChat = () => {
    return (
      <form action="/" className='absolute rounded border w-1/3 ml-140 mt-140 flex items-center'>
              <input type="text" className='h-10 w-full overflow-y-auto p-2' maxLength={1000} placeholder='Give a title...'/>
              <button className='text-3xl m-2 flex items-center'><ion-icon name="send"></ion-icon></button>
      </form>
    )
}

export default NewChat
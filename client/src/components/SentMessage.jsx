import React from 'react'
import '../../src/App.css'

const SentMessage = ({data}) => {
  return (
    <div className='w-full h-auto flex justify-end'>
        <div className='sent-message w-auto max-w-2/3 rounded-tl-lg rounded-tr-lg rounded-bl-lg p-2 m-2'>
        {data}
        </div>
    </div>
  )
}

export default SentMessage
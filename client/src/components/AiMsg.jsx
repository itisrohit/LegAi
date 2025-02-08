import React from 'react'
import '../../src/App.css'

const AiMsg = ({data}) => {
  return (
    <div className='w-full h-auto flex justify-start'>
        <div className='ai-msg w-auto max-w-2/3 rounded-tl-lg rounded-tr-lg rounded-br-lg p-2 m-2'>
        {data}
        </div>
    </div>
  )
}

export default AiMsg
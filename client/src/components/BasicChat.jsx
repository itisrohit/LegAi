import React from 'react'

const BasicChat = () => {
  return (
    <div className='absolute ml-15'>
        <div className='ml-100 mt-50 mb-3'>
            <h1 className='text-5xl font-extrabold'>Hi there, User</h1>
            <h2 className='text-6xl font-extrabold'>Can I help you with anything?</h2>
        </div>
        <div className='ml-100'>
            <h3 className='text-2xl mb-5'>Use one of the most common prompts <br/> below or use your own to begin</h3>
            <div className='flex space-x-1'>
                <p className='w-50 h-30 rounded-md border p-2 py-5'>What are my rights if falsely accused at work?</p>
                <p className='w-50 rounded-md border p-2 py-5'>Can my landlord refuse to return my deposit?</p>
                <p className='w-50 rounded-md border p-2 py-5'>What should I do after wrongful termination?</p>
                <p className='w-50 rounded-md border p-2 py-5'>What action can I take for workplace discrimination?</p>
            </div>
        </div>
    </div>
  )
}

export default BasicChat
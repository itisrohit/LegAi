import React, {useState} from 'react'
import '../../src/App.css'

const SidePanel = () => {
    const [isOpen, setIsOpen] = useState(true)
  return (
    <>
    { isOpen ? 
        <div className="side-panel w-14 absolute h-full text-3xl px-2">
            <div className='upperDiv flex flex-col space-y-4 items-start w-full'>
                <button className='my-2' onClick={()=>{setIsOpen(!isOpen)}}>
                    <ion-icon name="menu-outline"></ion-icon>
                </button>
                <button>
                        <ion-icon name="add-outline"></ion-icon>
                </button>
            </div>
        </div> 
    : 
    <div className="side-panel w-1/4 absolute h-full text-3xl px-2">
        <div className='upperDiv flex flex-col space-y-4 items-start w-full'>
            <button className='my-2' onClick={()=>{setIsOpen(!isOpen)}}>
                <ion-icon name="menu-outline"></ion-icon>
            </button>
            <button>
                    <ion-icon name="add-outline"></ion-icon>
            </button>
            <div className='text-xl rounded-md border w-full p-2 flex justify-between'>
                <p>Chat</p>
                <button><ion-icon name="trash"></ion-icon></button>
            </div>
            
        </div>
    </div>
    }
        
    </>
  )
}

export default SidePanel
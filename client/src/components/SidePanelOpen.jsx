import React from 'react'

const SidePanelOpen = () => {
    return (
        <div className="w-1/4 absolute border h-full text-3xl px-2">
            <div className='upperDiv flex flex-col space-y-4 items-start w-full'>
                <button className='m-3'>
                    <ion-icon name="menu-outline"></ion-icon>
                </button>
            <hr />
                <div className='text-xl rounded-md border w-full p-2 flex justify-between'>
                    <p>Chat</p>
                    <button><ion-icon name="trash"></ion-icon></button>
                </div>
            </div>
        </div>
      )
}

export default SidePanelOpen
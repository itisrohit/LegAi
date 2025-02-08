import React,{useState} from 'react'
import '../../src/App.css'

const InputForm = () => {
    const [inputLength, setinputLength] = useState(0)
    const inputHandler = (e)=>{
        setinputLength(e.target.value.length)
    }
  return (
    <form action="/" className='absolute rounded border w-2/3 ml-100 mt-140 flex'>
            <input type="text" className='h-20 w-full overflow-y-auto p-2' maxLength={1000} onChange={inputHandler} placeholder='Ask me anything...'/>
            <div className='w-25 flex flex-col justify-between'>
                <p className='text-center'>{inputLength} / 1000</p>
                <button className='text-2xl'><ion-icon name="arrow-up-outline"></ion-icon></button>
            </div>
    </form>
  )
}

export default InputForm
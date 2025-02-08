import React, { useState } from 'react';
import '../../src/App.css';

const InputForm = ({ onSendMessage }) => {
    const [inputText, setInputText] = useState("");
    const [inputLength, setInputLength] = useState(0);

    const inputHandler = (e) => {
        setInputText(e.target.value);
        setInputLength(e.target.value.length);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (inputText.trim() !== "") {
            onSendMessage(inputText);
            setInputText("");
            setInputLength(0);
        }
    };

    return (
        <form className='absolute rounded border w-2/3 ml-100 mt-140 flex' onSubmit={submitHandler}>
            <input 
                type="text" 
                className='h-20 w-full overflow-y-auto p-2' 
                maxLength={1000} 
                value={inputText} 
                onChange={inputHandler} 
                placeholder='Ask me anything...'
            />
            <div className='w-25 flex flex-col justify-between'>
                <p className='text-center'>{inputLength} / 1000</p>
                <button type="submit" className='text-2xl'>
                    <ion-icon name="arrow-up-outline"></ion-icon>
                </button>
            </div>
        </form>
    );
};

export default InputForm;

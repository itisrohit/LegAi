import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const chatSlice = createSlice({
  name: "chat",
  initialState: { messages: [] },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatSlice.actions;

export const saveMessageToBackend = (chatId, question, answer) => async (dispatch) => {
  try {
    const response = dispatch(addMessage({ chatId, question, answer })); // Update Redux store first

    console.log(response)

    await axios.post(`http://localhost:8080/api/v1/messages/${chatId}`, { query: question, answer });

  } catch (error) {
    console.error("Error saving message:", error);
  }
};

export default chatSlice.reducer;

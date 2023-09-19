import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  newMessages: [],
  arrivalMessage: null,
  createdGroup: false,
  newGroupCode: '',
};

export const messSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setNewMessages: (state, action) => {
      state.newMessages = action.payload;
    },
    setArrivalMessage: (state, action) => {
      state.arrivalMessage = action.payload;
    },
    setCreatedGroup: (state, action) => {
      state.createdGroup = action.payload;
    },
    setNewGroupCode: (state, action) => {
      state.newGroupCode = action.payload;
    },
  },
});

export const {
  setNewMessages,
  setArrivalMessage,
  setCreatedGroup,
  setNewGroupCode,
} = messSlice.actions;

export const getNewMessages = (state: any) => state.message.newMessages;
export const getArrivalMessage = (state: any) => state.message.arrivalMessage;
export const getCreatedGroup = (state: any) => state.message.createdGroup;
export const getNewGroupCode = (state: any) => state.message.newGroupCode;

export default messSlice.reducer;

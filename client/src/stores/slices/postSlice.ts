import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postView: null,
  postHome: [],
  step: 1,
};
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPostView: (state, action) => {
      state.postView = action.payload;
    },
    setPostHome: (state, action) => {
      state.postHome = action.payload;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
  },
});

export const { setPostView, setPostHome, setStep } = postSlice.actions;

export const getPostView = (state: any) => state.post.postView;
export const getPostHome = (state: any) => state.post.postHome;
export const getStep = (state: any) => state.post.step;

export default postSlice.reducer;

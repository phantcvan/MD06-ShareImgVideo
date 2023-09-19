import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  follows: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setFollows: (state, action) => {
      state.follows = action.payload;
    },
  },
});

export const { setCurrentUser, setFollows } = userSlice.actions;

export const getCurrentUser = (state: any) => state.user.currentUser;
export const getFollows = (state: any) => state.user.follows;

export default userSlice.reducer;

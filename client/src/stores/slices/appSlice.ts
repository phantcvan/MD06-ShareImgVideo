import { createSlice } from '@reduxjs/toolkit';
import { themeMode } from '../../constants';

const initialState = {
  currentWidth: null,
  loading: false,
  resStatus: '',
  theme: themeMode.dark,
  pickMenu: 'Home',
  location: '',
  showPostManage: '',
  createPost: false,
  editPost: false,
  post: null,
  follower: null,
  following: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentWidth: (state, action) => {
      state.currentWidth = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResStatus: (state, action) => {
      state.resStatus = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setPickMenu: (state, action) => {
      state.pickMenu = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setShowPostManage: (state, action) => {
      state.showPostManage = action.payload;
    },
    setCreatePost: (state, action) => {
      state.createPost = action.payload;
    },
    setEditPost: (state, action) => {
      state.editPost = action.payload;
    },
    setPost: (state, action) => {
      state.post = action.payload;
    },
    setFollower: (state, action) => {
      state.follower = action.payload;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
  },
});

export const {
  setCurrentWidth,
  setLoading,
  setTheme,
  setPickMenu,
  setResStatus,
  setLocation,
  setCreatePost,
  setShowPostManage,
  setEditPost,
  setPost,
  setFollower,
  setFollowing,
} = appSlice.actions;

export const getCurrentWidth = (state: any) => state.app.currentWidth;
export const getLoading = (state: any) => state.app.loading;
export const getResStatus = (state: any) => state.app.resStatus;
export const getTheme = (state: any) => state.app.theme;
export const getPickMenu = (state: any) => state.app.pickMenu;
export const getLocation = (state: any) => state.app.location;
export const getCreatePost = (state: any) => state.app.createPost;
export const getShowPostManage = (state: any) => state.app.showPostManage;
export const getEditPost = (state: any) => state.app.editPost;
export const getPost = (state: any) => state.app.post;
export const getFollower = (state: any) => state.app.follower;
export const getFollowing = (state: any) => state.app.following;

export default appSlice.reducer;

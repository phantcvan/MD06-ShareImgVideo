import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import userReducer from './slices/userSlice';
import postReducer from './slices/postSlice';
import messReducer from './slices/messageSlice';

const reducer = combineReducers({
  app: appReducer,
  user: userReducer,
  post: postReducer,
  message: messReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

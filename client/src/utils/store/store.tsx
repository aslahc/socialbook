// store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducers from '../reducers/userData'; // Assuming this is your user slice reducer
import userDetailsReducer from '../reducers/userDetails';
import postsReducer from '../reducers/PostData'

import TokenSlice  from "../reducers/TokenSlice";
const rootReducer = combineReducers({
  users: userReducers,
  userDetails: userDetailsReducer,
  postData:postsReducer,
  
  token:TokenSlice
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
});

export default store;
export type RootState = ReturnType<typeof rootReducer>;

// store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import userReducers from '../utils/reducers/userData'; // Assuming this is your user slice reducer
import userDetailsReducer from '../utils/reducers/userDetails';
import TokenSlice  from "./reducers/TokenSlice";
const rootReducer = combineReducers({
  users: userReducers,
  userDetails: userDetailsReducer,
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

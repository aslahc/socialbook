// store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducers from "../reducers/userData"; // Assuming this is your user slice reducer
import userDetailsReducer from "../reducers/userDetails";
import postsReducer from "../reducers/PostData";
import storyReducer from "../reducers/StoryData";
import friendReducer from "../reducers/FreindManage";
import TokenSlice from "../reducers/TokenSlice";
// import StoryData from "../reducers/StoryData";
const rootReducer = combineReducers({
  users: userReducers,
  userDetails: userDetailsReducer,
  postData: postsReducer,
  StoryData: storyReducer,
  token: TokenSlice,
  firiend: friendReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export default store;
export type RootState = ReturnType<typeof rootReducer>;

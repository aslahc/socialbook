import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPost, PostState } from "../../types/types";
import { ActivityIcon } from "lucide-react";

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<IPost[]>) => {
      state.posts = action.payload;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    addPost: (state, action: PayloadAction<IPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<IPost>) => {
      const updatedPost = action.payload; 
      const index = state.posts.findIndex((post) => post._id === updatedPost._id);
      if (index !== -1) {
        // Update the existing post object with the updated fields
        state.posts[index] = { ...state.posts[index], ...updatedPost };
        console.log("reducers upateeddd")

      }
    },
  },
});

export const { setPost , deletePost,updatePost  ,addPost} = postSlice.actions;
export default postSlice.reducer;

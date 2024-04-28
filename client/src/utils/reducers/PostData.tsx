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
  },
});

export const { setPost , deletePost,} = postSlice.actions;
export default postSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../../types/types";

interface FriendState {
  friends: User[];
}

const initialState: FriendState = {
  friends: [],
};
const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    // Reducer to set list of friends
    setFriends: (state, action: PayloadAction<User[]>) => {
      state.friends = action.payload;
    },
    // Reducer to add a new friend
    addFriend: (state, action: PayloadAction<User>) => {
      state.friends.push(action.payload);
    },
    // Reducer to remove a friend
    removeFriend: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(
        (friend) => friend._id !== action.payload
      );
    },
    // Reducer to clear friends list
    clearFriends: (state) => {
      state.friends = initialState.friends; // Reset friends state to initial value
    },
  },
});

// Export actions and reducer
export const { setFriends, addFriend, removeFriend, clearFriends } =
  friendSlice.actions;
export default friendSlice.reducer;

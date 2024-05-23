import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersState } from "../../types/types"; // Make sure to import User interface

const initialState: UsersState = {
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    followUser: (
      state,
      action: PayloadAction<{ userId: string; followerId: string }>
    ) => {
      const { userId, followerId } = action.payload;
      const userToFollow = state.users.find((user) => user._id === userId);
      if (userToFollow) {
        // Add followerId to the followers array of the user
        if (!userToFollow.followers) {
          userToFollow.followers = [];
        }
        userToFollow.followers.push(followerId);
      }
    },
    unfollowUser: (
      state,
      action: PayloadAction<{ userId: string; followerId: string }>
    ) => {
      const { userId, followerId } = action.payload;
      const userToUnfollow = state.users.find((user) => user._id === userId);
      if (userToUnfollow) {
        // Remove followerId from the followers array of the user
        if (userToUnfollow.followers) {
          userToUnfollow.followers = userToUnfollow.followers.filter(
            (id) => id !== followerId
          );
        }
      }
    },
  },
});

export const { setUsers, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;

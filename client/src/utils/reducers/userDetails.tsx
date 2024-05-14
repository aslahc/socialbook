import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState } from '../../types/types';

// Define initial state
const initialState: UserState = {
  user: null,
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer to set user details
    setUserDetails: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    // Reducer to clear user data
    clearUserData: (state) => {
      state.user = null; // Reset user state to null (logout)
    },
    followingUser: (state, action: PayloadAction<{ userId: string, followerId: string }>) => {
      const { userId, followerId } = action.payload;

      if (state.user && state.user._id === followerId) {
        // Update the following array of the logged-in user (follower)
        if (!state.user.following) {
          state.user.following = [];
        }
        state.user.following.push(userId); // Add userId to following array
      }
    },
    unfollowingUser: (state, action: PayloadAction<{ userId: string, followerId: string }>) => {
      const { userId, followerId } = action.payload;

      if (state.user && state.user._id === followerId && state.user.following) {
        // Remove userId from the following array of the logged-in user (follower)
        state.user.following = state.user.following.filter(id => id !== userId);
      }
    },
  },
});

// Export actions and reducer
export const { setUserDetails, clearUserData, followingUser ,unfollowingUser } = userSlice.actions;
export default userSlice.reducer;

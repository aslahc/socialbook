import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../../types/types";

// Define initial state
const initialState: UserState = {
  user: [],
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer to set user details
    setUserDetails: (state, action: PayloadAction<User[]>) => {
      state.user = action.payload;
    },
    // Reducer to clear user data
    clearUserData: (state) => {
      state.user = initialState.user; // Reset user state to initial value
    },
  },
});

// Export actions and reducer
export const { setUserDetails, clearUserData } = userSlice.actions;
export default userSlice.reducer;

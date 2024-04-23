import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UsersState } from "../../types/types"; // Make sure to import User interface

const initialState: UsersState = {
  users: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;

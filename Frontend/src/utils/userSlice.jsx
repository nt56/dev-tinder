import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    updatePassword: (state, action) => {
      if (state) {
        state.password = action.payload; // Updating password in the store
      }
    },
    removeUser: () => {
      return null;
    },
  },
});

export const { addUser, removeUser, updatePassword } = userSlice.actions;

export default userSlice.reducer;

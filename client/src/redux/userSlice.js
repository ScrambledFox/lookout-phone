import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    colour: "#ff0000",
    avatarSeed: "12345",
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.colour = action.payload.colour;
      state.avatarSeed = action.payload.avatarSeed;
    },
    setColour: (state, action) => {
      state.colour = action.payload;
    },
    setAvatarSeed: (state, action) => {
      state.avatarSeed = action.payload;
    },
  },
});

export const { setUser, setColour, setAvatarSeed } = userSlice.actions;

export default userSlice.reducer;

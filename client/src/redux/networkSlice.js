import { createSlice } from "@reduxjs/toolkit";

export const networkSlice = createSlice({
  name: "network",
  initialState: {
    socket: null,
    isConnected: false,
    lastPong: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload.socket;
    },
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    receivedPong: (state, action) => {
      state.receivedPong = new Date().toISOString();
    },
  },
});

export const { setSocket, setConnected, receivedPong } = networkSlice.actions;
export default networkSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import networkReducer from "./networkSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    network: networkReducer,
  },
});

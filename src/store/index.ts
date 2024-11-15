//@ts-nocheck
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./root.reducer";
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const store = configureStore({
  reducer: rootReducer
});

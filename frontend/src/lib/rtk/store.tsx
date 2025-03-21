import { configureStore } from "@reduxjs/toolkit";
import { dashboardSlice } from "./slices/dashboardSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { documentDetailSlice } from "./slices/documentDetailSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
    documentDetail: documentDetailSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useRtk: TypedUseSelectorHook<RootState> = useSelector;

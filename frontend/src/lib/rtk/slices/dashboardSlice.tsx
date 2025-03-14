import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type DashboardSlice = {
  search: string;
};

const initialState: DashboardSlice = {
  search: "",
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setDashboardSearch } = dashboardSlice.actions;

export default dashboardSlice.reducer;

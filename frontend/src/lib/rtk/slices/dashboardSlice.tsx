import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type DashboardSlice = {
  search: string;
};

const initialState: DashboardSlice = {
  search: "",
};

export const dashboardSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setDashboardSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDashboardSearch } = dashboardSlice.actions;

export default dashboardSlice.reducer;

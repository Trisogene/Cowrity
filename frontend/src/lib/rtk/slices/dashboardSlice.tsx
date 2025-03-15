import { Document } from "@/lib/axios/services/documentServices/documentServices.d";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type DashboardSlice = {
  search: string;
  documents: Document[];
};

const initialState: DashboardSlice = {
  search: "",
  documents: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setDocuments: (state, action: PayloadAction<Document[]>) => {
      state.documents = action.payload;
    },
  },
});

export const { setDashboardSearch, setDocuments } = dashboardSlice.actions;

export default dashboardSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
}

type DocumentDetailSlice = {
  isSocketConnected: boolean;
  users: User[];
};

const initialState: DocumentDetailSlice = {
  isSocketConnected: false,
  users: [],
};

export const documentDetailSlice = createSlice({
  name: "documentDetail",
  initialState,
  reducers: {
    setIsSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    setDocumentDetailUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setIsSocketConnected, setDocumentDetailUsers } =
  documentDetailSlice.actions;

export default documentDetailSlice.reducer;

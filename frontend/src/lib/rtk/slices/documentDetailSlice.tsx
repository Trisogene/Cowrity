import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  username: string;
}

type DocumentDetailSlice = {
  isSocketConnected: boolean;
  hasJoinedRoom: boolean;
  users: User[];
  username: string;
  editorContent: string;
};

const initialState: DocumentDetailSlice = {
  isSocketConnected: false,
  users: [],
  hasJoinedRoom: false,
  username: "",
  editorContent: "",
};

export const documentDetailSlice = createSlice({
  name: "documentDetail",
  initialState,
  reducers: {
    setIsSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setHasJoinedRoom: (state, action) => {
      state.hasJoinedRoom = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEditorContent: (state, action) => {
      state.editorContent = action.payload;
    },
  },
});

export const {
  setIsSocketConnected,
  setUsers,
  setHasJoinedRoom,
  setUsername,
  setEditorContent,
} = documentDetailSlice.actions;

export default documentDetailSlice.reducer;

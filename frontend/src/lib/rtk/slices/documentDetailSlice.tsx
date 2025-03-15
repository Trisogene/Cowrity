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
};

const initialState: DocumentDetailSlice = {
  isSocketConnected: false,
  users: [],
  hasJoinedRoom: false,
  username: "",
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
  },
});

export const { setIsSocketConnected, setUsers, setHasJoinedRoom, setUsername } =
  documentDetailSlice.actions;

export default documentDetailSlice.reducer;

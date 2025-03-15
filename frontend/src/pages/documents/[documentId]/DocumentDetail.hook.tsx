import { FormEvent, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  setHasJoinedRoom,
  setUsername,
  setUsers,
} from "@/lib/rtk/slices/documentDetailSlice";
import { useRtk } from "@/lib/rtk/store";
import { MOCK_DOCUMENTS } from "@/pages/Dashboard/DashboardDocuments/DashboardDocumentsGrid/DashboardDocumentsGrid.mock";
import { useDispatch } from "react-redux";
import { useDocumentDetailSocket } from "./DocumentDetail.context";

const useDocumentDetail = () => {
  const dispatch = useDispatch();
  const { sectionId } = useParams<{ sectionId: string }>();
  const isSocketConnected = useRtk(
    (state) => state.documentDetail.isSocketConnected
  );
  const username = useRtk((state) => state.documentDetail.username);

  const hasJoinedRoom = useRtk((state) => state.documentDetail.hasJoinedRoom);

  const { socket } = useDocumentDetailSocket();

  useEffect(() => {
    if (!socket || !isSocketConnected) return;

    socket.on("user-joined", ({ users: roomUsers }) => {
      dispatch(setUsers(roomUsers));
    });

    socket.on("user-left", ({ users: roomUsers }) => {
      dispatch(setUsers(roomUsers));
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket, isSocketConnected]);

  const handleJoinRoom = (e: FormEvent) => {
    e.preventDefault();
    if (!socket || !sectionId || !username.trim()) return;

    socket.emit("join-room", { roomId: sectionId, username });
    dispatch(setHasJoinedRoom(true));
  };

  const documentName = MOCK_DOCUMENTS.find(
    (doc) => doc.id === sectionId
  )?.title;

  const onChangeUsername = (e: FormEvent<HTMLInputElement>) => {
    dispatch(setUsername(e.currentTarget.value));
  };

  return {
    username,
    isSocketConnected,
    onChangeUsername,
    hasJoinedRoom,
    handleJoinRoom,
    documentName,
  };
};

export default useDocumentDetail;

import { setIsSocketConnected } from "@/lib/rtk/slices/documentDetailSlice";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useDispatch } from "react-redux";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface DocumentDetailProvider {
  children: ReactNode;
}

export const DocumentDetailProvider: React.FC<DocumentDetailProvider> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      dispatch(setIsSocketConnected(true));
    });

    newSocket.on("disconnect", () => {
      dispatch(setIsSocketConnected(false));
    });

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useDocumentDetailSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

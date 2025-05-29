import { useSocketStore } from "@/lib/socketStore";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket";

export const useSocket = (userId: string) => {
  const setSocket = useSocketStore((state) => state.setSocket);
  const clearSocket = useSocketStore((state) => state.clearSocket);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000");

    setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", userId);
    });

    return () => {
      socket.disconnect();
      clearSocket();
      console.log("Disconnected socket");
    };
  }, [userId, setSocket, clearSocket]);
};

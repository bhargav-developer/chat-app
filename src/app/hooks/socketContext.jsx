"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:4000");

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join",userId);
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected socket");
    };
  }, [userId]);

  return socketRef;
};

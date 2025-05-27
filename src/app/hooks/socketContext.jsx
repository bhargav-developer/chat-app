"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:4000",{
      query: { userId },
      transports: ["websocket"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join",userId);
    });

      socket.on("recieve-message",(msg)=>{
      console.log("got a msg",msg)
    })



    return () => {
      socket.disconnect();
      console.log("Disconnected socket");
    };
  }, [userId]);

  return socketRef;
};

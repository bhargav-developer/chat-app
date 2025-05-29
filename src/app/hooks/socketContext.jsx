"use client";
import { useSocketStore } from "@/lib/socketStore";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  useSocketStore()
  
  useEffect(() => {
    const socket = io("http://localhost:4000");

  
     useSocketStore.getState().setSocket(socket);

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join",userId);
    });

    //   socket.on("receive-message", (msg) => {
    //   console.log("msg:", msg);

    // });

  



    return () => {
      socket.disconnect();
      useSocketStore.getState().clearSocket();
      console.log("Disconnected socket");
    };
  }, [userId]);

};


import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
    const socket = io("http://localhost:4000");


    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("join", { userId });
      console.log(userId)
    });

 

};

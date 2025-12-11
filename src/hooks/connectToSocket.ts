// hooks/useJoinSocket.ts
import { useEffect } from "react";
import { useSocketStore } from "@/lib/socketStore";

export const useJoinSocket = (userId?: string | null) => {
  const socket = useSocketStore((s) => s.socket);
  useEffect(() => {
    if (!socket || !userId) return;
    
    const handleConnect = () => {
      socket.emit("join", userId);
  console.log("got areq to join socket 2")

    };

    // If already connected → join immediately
    if (socket.connected) {
      handleConnect();
    } else {

      socket.once("connect", handleConnect);
    }

    // ✅ Proper cleanup function
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, userId]);
};

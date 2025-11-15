"use client";
import { ReactNode, useEffect, useState } from "react";
import { useUserStore } from "@/lib/userStore";
import axios, { AxiosError } from "axios";
import SideBar from "@/Components/sideBar";
import { useSocketStore } from "@/lib/socketStore";
import { useUsersStore } from "@/lib/usersStore";
import ReqPopUp from "@/Components/ReqPopUp";
import FileRecieve from "@/Components/FileRecieve";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const socket = useSocketStore((state) => state.socket);
  const [recieve, setRecieve] = useState(false);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [recieveReq, setRecieveReq] = useState(false);
  const [roomId,setRoomId] = useState<string | null>(null)
  const [recieverName, setRecieveName] = useState<string>("");
  const { setStatus } = useUsersStore();

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleFileTransferReq = (msg: { senderName: string; senderId: string; roomId: string }) => {
      if (msg.senderName) {
        setRecieveReq(true);
        setRecieveName(msg.senderName);
        setSenderId(msg.senderId);
        setRoomId(msg.roomId)
      }else{
        setRecieveReq(false)
      }
    };

    socket.on("update_users", (data) => {
      Object.entries(data).forEach(([userId, statusData]) => {
        setStatus(userId, statusData);
      });
    });

    socket.on("receiver-file-transfer-request", handleFileTransferReq);
    socket.on("rejected-file-transfer",(data) => {
      toast.error(`${data.userName ?  `${data.userName} rejected Your file request` : "file transfer request has been rejected" }`)
    })

    return () => {
      socket.off("receiver-file-transfer-request", handleFileTransferReq);
    };
  }, [socket]);

  const handleReqAccept = () => {
    if (!socket) return;
    socket.emit("accept-file-transfer", {  senderId,roomId,reciverId: user?.id });
    setRecieve(true);
    setRecieveReq(false);
  };

  const handleReqReject = () => {
    if (!socket) return;
    setRecieveReq(false);
    socket.emit("reject-file-transfer", { from: senderId,roomId,userName: user?.name });
  };

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const { _id, firstName, lastName, email, avatar } = res.data.user;
      setUser({
        id: _id,
        email,
        name: `${firstName} ${lastName}`,
        avatar,
      });
    } catch (error) {
      const err = error as AxiosError;
      if (err.status === 401) router.push("/login");
    }
  };

  return (
    <div className="relative flex h-screen w-full bg-white text-black overflow-hidden">
      <Toaster/>
      {user?.id && <SideBar />}

      {/* Main content */}
      <main
        className="
          flex-1 min-h-screen 
      
          pt-[64px] md:pt-0
          transition-all
          overflow-y-auto
        "
      >
        {children}

        {/* Popup layers */}
        {recieveReq && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
            <ReqPopUp
              sender={recieverName}
              timeout={10}
              onAccept={handleReqAccept}
              onReject={handleReqReject}
            />
          </div>
        )}

        {recieve && <FileRecieve onClose={() => setRecieve(false)} />}
      </main>
    </div>
  );
}

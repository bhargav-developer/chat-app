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
import toast from "react-hot-toast";
import { fileTransferStore } from "@/lib/fileTransferStore";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const socket = useSocketStore((state) => state.socket);
  const [recieveReq, setRecieveReq] = useState(false);
  const [recieve, setRecieve] = useState(false);
  const [incoming, setIncoming] = useState<any>(null);
  const { setStatus } = useUsersStore();
  const { setRoomId } = fileTransferStore();

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleFileTransferReq = (msg: { senderName: string; senderId: string; roomId: string; fileName: string; fileType: string; size: number }) => {
      setIncoming(msg);
      setRecieveReq(true);
      setRoomId(msg.roomId);
    };

    socket.on("receiver-file-transfer-request", handleFileTransferReq);

    socket.on("rejected-file-transfer", (data) => {
      toast.error(`${data ? `${data} rejected your file request` : "File transfer request rejected"}`);
    });

    socket.on("update_users", (users) => {
      Object.entries(users).forEach(([uid, state]) => setStatus(uid, state));
    });

    return () => {
      socket.off("receiver-file-transfer-request");
      socket.off("rejected-file-transfer");
      socket.off("update_users");
    };
  }, [socket]);

  const handleReqAccept = async () => {
    if (!socket || !incoming) return;

    const supportsFS = "showSaveFilePicker" in window;

    try {
      if (supportsFS) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: incoming.fileName + ".part",
        });
        (window as any).__fileWriter = await handle.createWritable();
      } else {
        (window as any).__fileBuffers = []; // fallback for Firefox/Safari
      }
    } catch {
      // If user cancels picker, stop transfer
      socket.emit("reject-file-transfer", { from: incoming.senderId, roomId: incoming.roomId, userName: user?.name });
      setRecieveReq(false);
      return;
    }

    socket.emit("accept-file-transfer", { roomId: incoming.roomId });
    setRecieve(true);
    setRecieveReq(false);
  };

  const handleReqReject = () => {
    if (socket && incoming) {
      socket.emit("reject-file-transfer", { from: incoming.senderId, roomId: incoming.roomId, userName: user?.name });
    }
    setRecieveReq(false);
  };

  const getUserInfo = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      const { _id, firstName, lastName, email, avatar } = res.data.user;
      setUser({ id: _id, email, name: `${firstName} ${lastName}`, avatar });
    } catch (error) {
      const err = error as AxiosError;
      if (err.status === 401) router.push("/login");
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-white text-black">
      {user?.id && <SideBar />}

      <main className="flex-1 overflow-auto pt-[64px] md:pt-0">
        {children}

        {recieveReq && incoming && (
          <ReqPopUp
            sender={incoming.senderName}
            filename={incoming.fileName}
            size={incoming.size}
            onAccept={handleReqAccept}
            onReject={handleReqReject}
          />
        )}

        {recieve && <FileRecieve onClose={() => setRecieve(false)} />}
      </main>
    </div>
  );
}

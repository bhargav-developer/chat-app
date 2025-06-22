"use client";
import { FC, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/userStore";

import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useSocket } from "../hooks/socketContext";
import sideBar from "@/Components/sideBar";
import SideBar from "@/Components/sideBar";
import { useSocketStore } from "@/lib/socketStore";
import { useUsersStore } from "@/lib/usersStore";
import ReqPopUp from "@/Components/ReqPopUp";
import FileRecieve from "@/Components/FileRecieve";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const socket = useSocketStore((state) => state.socket);
  const [recieve, setRecieve] = useState(false);
  const [senderId, setSenderId] = useState(null);
  const [recieveReq, setRecieveReq] = useState(false);
  const [recieverName, setRecieveName] = useState<string>("");
  //  const [isOpen, setIsOpen] = useState(false);
  //   const { statusMap, setStatus } = useUsersStore();

  useEffect(() => {
    getUserInfo();
  }, []);


  useEffect(() => {
    if (!socket) return;

    // const handleMessage = (msg: any) => {
    //   setMessages((prev: any) => [...prev, msg]);
    // };

    const handleFileTransferReq = (msg: any) => {
      if (msg.sender) {
        setRecieveName(msg.sender)
        setRecieveReq(true)
        setSenderId(msg.senderId)
      }
    };

    // socket.on("update_users", (data) => {
    //    Object.entries(data).forEach(([userId, statusData]) => {
    //     setStatus(userId, statusData);
    //   });
    // });



    // socket.on("file-transfer", () => {
    //   setUplaod(true)
    // })

    // socket.on("receive-message", handleMessage);
    socket.on("file-transfer-request", handleFileTransferReq);
    return () => {
      // socket.off("receive-message", handleMessage);
      socket.off("file-transfer-request", handleFileTransferReq);
    };
  }, [socket]);

  const handleReqAccept = async () => {
    try {
      if (!socket) return;
      setRecieve(true)
      setRecieveReq(false)
     socket.emit("accept-file-transfer", {
        from: senderId
      }) 

    } catch (error) {
      console.log(error)
    }
  }


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
    } catch (error: any) {
      console.error(error);
      if (error.status === 401) {
        router.push("/login");
      }
    }
  };

  return (
    <div className="flex h-full w-full">
      {user?.id && <SideBar />}
      {/* Main content */}
      <main className="flex-1 bg-white text-black ml-[250px] min-h-screen">
        {children}
        {recieveReq &&
          <div className='absolute h-full w-full'>
            <ReqPopUp
              sender={recieverName}
              timeout={10}
              onAccept={handleReqAccept}
              onReject={() => setRecieveReq(false)}
            />
          </div>
        }
        {
          recieve && <FileRecieve onClose={() => setRecieve(false)} />

        }
      </main>
    </div>
  );
}

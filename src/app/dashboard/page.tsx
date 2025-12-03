"use client";

import { useUserStore } from "@/lib/userStore";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import SplitText from "@/Components/AnimationText";
import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../apiEndPoints/auth";
import Avatar from "@/Components/Avatar";
import { useUsersStore } from "@/lib/usersStore";
import { useSocketStore } from "@/lib/socketStore";



interface Chats {
  userId: string,
  avatar: string,
  firstName: string,
  lastMessage: string,
  timeStamp: string
}

export default function Home() {


  const { user } = useUserStore();
  const router = useRouter();
  const [recentChats, setRecentChats] = useState<Chats[]>([]);
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET;
  const {socket} = useSocketStore();
  const { statusMap, setStatus } = useUsersStore();


  useEffect(() => {
    if(user && user.id){
      findRecentChats()
    }
  }, [user])


  useEffect(() => {
  if(!socket) return
  socket.on("receive-message",()=>{
      findRecentChats()
  })
  }, [socket])
  const handleLogout = async () => {
    try {
      const req = await logout();
      if (req) {
        router.push("/login")
      }
    }
    catch (error: Error | any) {
      const errorMessage = error.message ? error.message : "an error occcured"
      toast.error(errorMessage)
    }
  }

  const findRecentChats = async () => {
    try {
      const userId = user?.id
      const res = await axios.get(`${socketUrl}/messages/chats`, {
        params: {
          userId
        }
      })
      const data = await res.data;
      if (data) {
        setRecentChats(data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Demo Data
  const unrepliedMessages = 3;


  return (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            {user?.name &&
              <SplitText
                text={`Hello, ${user?.name}`}
                className="md:text-4xl text-xl p-1 font-semibold text-center"

                delay={100}

                duration={0.4}

                ease="power3.out"

                splitType="chars"

                from={{ opacity: 0, y: 40 }}

                to={{ opacity: 1, y: 0 }}

                threshold={0.1}

                rootMargin="-100px"

                textAlign="center"

              />
            }
            <p className="text-sm text-gray-500">You have {unrepliedMessages} unreplied messages.</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative cursor-pointer">
              <Bell className="text-gray-600 hover:text-indigo-600 transition" size={22} />
              {unrepliedMessages > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                  {unrepliedMessages}
                </span>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm cursor-pointer flex items-center gap-2 text-red-500 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8  space-y-8">

          {/* Recent Chats */}
          <section className="bg-white shadow pl-5  rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Chats</h2>
              {/* <button className="text-sm text-indigo-600 hover:underline">View all</button> */}
            </div>

            <div className="space-y-4">
              {recentChats && recentChats.map((chat, index) => (
                <div onClick={() => router.push(`/dashboard/chats/${chat.userId}`)} key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 cursor-pointer rounded-md transition">
                  <div className="flex justify-center items-center gap-4">
                    <Avatar avatarUrl={chat.avatar} isOnline={statusMap.get(chat.userId)?.online} />
                    <div>
                      <p className="font-medium text-gray-800">{chat.firstName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[150px] md:max-w-[400px] ">{chat.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400 flex-shrink-0 flex items-center gap-2">
                    <span>{new Date(chat.timeStamp).toLocaleTimeString()}</span>
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}


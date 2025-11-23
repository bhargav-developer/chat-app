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
  const { statusMap, setStatus } = useUsersStore();


  useEffect(() => {
    findRecentChats()
  }, [user])

  const handleLogout = async () => {
    try {
      const req = await logout();
      if (req) {
        router.push("/login")
      }
    }
    catch (error: Error | any) {
      const errorMessage = error.message ? error.message : "an error occcured"
      toast.error("an err occured")
    }
  }

  const findRecentChats = async () => {
    try {
      const userId = user?.id
      console.log("user id ",userId)
      const res = await axios.get(`${socketUrl}/messages/chats`, {
        params: {
          userId
        }
      })
      const data = await res.data;
      console.log(data)
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
        <main className="px-6 py-8 space-y-8">
          {/* Dashboard Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatCard title="Total Users" value="1,234" icon={<Users className="text-indigo-500" />} />
            <StatCard title="Messages Sent" value="12,345" icon={<MessageSquare className="text-green-500" />} />
            <StatCard title="Active Sessions" value="42" icon={<Activity className="text-orange-500" />} />
          </div> */}

          {/* Recent Chats */}
          <section className="bg-white shadow  rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Chats</h2>
              {/* <button className="text-sm text-indigo-600 hover:underline">View all</button> */}
            </div>

            <div className="space-y-4">
              {recentChats && recentChats.map((chat, index) => (
                <div onClick={() => router.push(`/dashboard/chats/${chat.userId}`)} key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition">
                  <div className="flex items-center gap-4">
                    <Avatar avatarUrl={chat.avatar} isOnline={statusMap.get(chat.userId)?.online} />
                    <div>
                      <p className="font-medium text-gray-800">{chat.firstName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px] md:max-w-[400px] ">{chat.lastMessage}</p>
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

// Dashboard Card Component
// function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
//   return (
//     <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
//       <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{title}</p>
//         <p className="text-2xl font-bold text-indigo-600 mt-1">{value}</p>
//       </div>
//     </div>
//   );
// }

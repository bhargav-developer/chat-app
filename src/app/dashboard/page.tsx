"use client";

import { useUserStore } from "@/lib/userStore";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import {
  Bell,
  LogOut,
  MessageSquare,
  Users,
  Activity,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { user } = useUserStore();
  const router = useRouter();

  // Demo Data
  const unrepliedMessages = 3;
  const recentChats = [
    {
      id: 1,
      name: "Alice Johnson",
      message: "Hey! Can we reschedule the meeting?",
      time: "2 mins ago",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "John Smith",
      message: "Shared the docs on Slack.",
      time: "10 mins ago",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 3,
      name: "Maria Garcia",
      message: "Let’s catch up today?",
      time: "30 mins ago",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        {/* Top Navbar */}
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome, {user?.name || "Guest"} 👋
            </h1>
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
              onClick={() => router.push("/logout")}
              className="text-sm flex items-center gap-2 text-red-500 hover:text-red-600 transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8 space-y-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <StatCard title="Total Users" value="1,234" icon={<Users className="text-indigo-500" />} />
            <StatCard title="Messages Sent" value="12,345" icon={<MessageSquare className="text-green-500" />} />
            <StatCard title="Active Sessions" value="42" icon={<Activity className="text-orange-500" />} />
          </div>

          {/* Recent Chats */}
          <section className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Chats</h2>
              <button className="text-sm text-indigo-600 hover:underline">View all</button>
            </div>

            <div className="space-y-4">
              {recentChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition">
                  <div className="flex items-center gap-4">
                    <Image
                      src={chat.avatar}
                      alt={chat.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{chat.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{chat.message}</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400 flex-shrink-0 flex items-center gap-2">
                    <span>{chat.time}</span>
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
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-indigo-600 mt-1">{value}</p>
      </div>
    </div>
  );
}

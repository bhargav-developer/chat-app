"use client";
import { FC, ReactNode, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/userStore";
import {
  HouseIcon,
  UserIcon,
  MessageSquareText,
  UsersIcon,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useSocket } from "../hooks/socketContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface BtnProps {
  href: string;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function Btn({ href, name, Icon }: BtnProps) {
  const currentPath = usePathname();
  const isActive = href === currentPath;

  return (
    <Link
      href={href}
      className={`flex gap-4 p-3 rounded-lg items-center transition-colors duration-150 ${
        isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-indigo-50"
      }`}
    >
      <Icon className="text-xl" />
      <h1 className="text-base">{name}</h1>
    </Link>
  );
}

const currentLinks = [
  { name: "Dashboard", href: "/dashboard", Icon: HouseIcon },
  { name: "Profile", href: "/dashboard/profile", Icon: UserIcon },
  { name: "Conversations", href: "/dashboard/chats", Icon: MessageSquareText },
  { name: "Group Chats", href: "/dashboard/group-chats", Icon: UsersIcon },
  { name: "Settings", href: "/dashboard/settings", Icon: Settings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    getUserInfo();
  }, []);

  useSocket(user?.id || "");

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
      {/* Sidebar */}
      <div className="w-[250px] fixed h-full bg-white text-black flex border-r border-gray-100 flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-indigo-600 text-2xl">Chat Sync</h2>
        </div>
        <nav className="flex-1 p-3 gap-3 flex flex-col">
          {currentLinks.map(({ href, name, Icon }) => (
            <Btn key={href} href={href} name={name} Icon={Icon} />
          ))}
        </nav>

        <div className="border-t overflow-hidden border-gray-100 flex gap-2 p-3 items-center">
          <img
            src={user?.avatar}
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="font-bold text-base">{user?.name}</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-white text-black ml-[250px] min-h-screen">
        {children}
      </main>
    </div>
  );
}

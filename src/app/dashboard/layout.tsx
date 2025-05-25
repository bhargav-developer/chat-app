"use client"
import { FC, ReactNode } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/userStore";
import User from "@/Models/user";
import { HouseIcon,UserIcon,MessageSquareText, UsersIcon, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
}
interface BtnProps {
  href: string;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
}


function Btn(arg: BtnProps) {
  const currentPath = usePathname();
    const { href, name, Icon } = arg
  const isActive = href === currentPath;

  return (
    <Link
      href={href}
      className={`flex gap-4 p-3 rounded-lg items-center ${isActive ? "bg-indigo-100": "hover:bg-indigo-50"}  `}
    >
      <Icon className={`${isActive ? "text-indigo-600" : ""} text-xl`} />
      <h1 className={`text-base ${isActive ? "text-indigo-600" : ""}`}>{name}</h1>
    </Link>
  );
}
const currentLinks = [
    {
        name: "Dashboard",
        href: "/dashboard",
        Icon: HouseIcon,
    },
     {
        name: "Profile",
        href: "/dashboard/profile",
        Icon: UserIcon,
    },
       {
        name: "Conversations",
        href: "/dashboard/chats",
        Icon: MessageSquareText,
    },
       {
        name: "Group Chats",
        href: "/dashboard/group-chats",
        Icon: UsersIcon,
    },
       {
        name: "Settings",
        href: "/dashboard/settings",
        Icon: Settings,
    },

]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
const {user} = useUserStore();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div className="w-[250px] bg-white text-black flex border-r border-gray-100 flex-col">
        <div className="p-6 border-b border-gray-100">
        <h2 className="font-bold text-indigo-600 text-2xl" >Chat Sync</h2>
        </div>
        <nav className="flex-1 p-3 gap-3 flex flex-col">
     {currentLinks.map(({ href, name, Icon }) => (
    <Btn key={href} href={href} name={name} Icon={Icon} />
  ))}
        </nav>

        <div className="border-t overflow-hidden border-gray-100 flex gap-2 p-3 ">
            <div>
    <img src={user?.avatar} className="w-10 h-10" alt="" />
            </div>
            
            <div>
                <h1 className="font-bold text-base">{user?.name}</h1>
                <p className="">{user?.email}</p>
            </div>
        </div>

      </div>

      {/* Main content */}
      <main className="w-[90%] p-3 bg-white text-black">
        {children}
      </main>
    </div>
  );
}

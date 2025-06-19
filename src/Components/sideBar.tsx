import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react'
import {
  HouseIcon,
  UserIcon,
  MessageSquareText,
  UsersIcon,
  Settings,
  LogOutIcon,
} from "lucide-react";
import { useUserStore } from '@/lib/userStore';
import { useSocket } from '@/app/hooks/socketContext';
import Avatar from './Avatar';
import axios from 'axios';

const SideBar = () => {

  const {user} = useUserStore();


  interface BtnProps {
    href: string;
    name: string;
    Icon: React.ComponentType<{ className?: string }>;
  }

  const handleLogOut = async () => {
    const res = axios.get("/api/auth/logOut",{withCredentials: true})
  }



  function Btn({ href, name, Icon }: BtnProps) {
    const currentPath = usePathname();
    const isActive = href === currentPath;

    return (
      <Link
        href={href}
        className={`flex gap-4 p-3 rounded-lg items-center transition-colors duration-150 ${isActive ? "bg-indigo-100 text-indigo-600" : "hover:bg-indigo-50"
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


    useSocket(user?.id || "");

  return (
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
       <Avatar avatarUrl={user?.avatar}/>
        <div>
          <h1 className="font-bold text-base">{user?.name}</h1>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
        <div onClick={handleLogOut}>
        <LogOutIcon/>
      </div>
      </div>
      
    </div>
  )
}

export default SideBar
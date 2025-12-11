"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  HouseIcon,
  UserIcon,
  MessageSquareText,
  UsersIcon,
  Settings,
  LogOutIcon,
  Menu,
  X,
} from "lucide-react";
import { useUserStore } from "@/lib/userStore";
import Avatar from "./Avatar";
import { logout } from "@/app/apiEndPoints/auth";
import { useJoinSocket } from "@/hooks/connectToSocket";

const SideBar = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const handleLogOut = async () => {
    try {
      const req = await logout();
      if (req) router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const links = [
    { name: "Dashboard", href: "/dashboard", Icon: HouseIcon },
    { name: "Profile", href: "/dashboard/profile", Icon: UserIcon },
    { name: "Conversations", href: "/dashboard/chats", Icon: MessageSquareText },
    { name: "Group Chats", href: "/dashboard/group-chats", Icon: UsersIcon },
    { name: "Settings", href: "/dashboard/settings", Icon: Settings },
  ];

  useJoinSocket(user?.id || "");

  function NavBtn({ href, name, Icon }: any) {
    const isActive = href === pathname;
    return (
      <Link
        href={href}
        className={`flex gap-4 p-3 rounded-lg items-center transition-colors duration-150 ${
          isActive
            ? "bg-indigo-100 text-indigo-600"
            : "hover:bg-indigo-50 text-gray-700"
        }`}
        onClick={() => setIsOpen(false)} // close sidebar on mobile when link clicked
      >
        <Icon className="text-xl shrink-0" />
        <h1 className="text-base">{name}</h1>
      </Link>
    );
  }

  return (
    <>
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-30">
        <h2 className="font-bold text-indigo-600 text-xl">Chat Sync</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-indigo-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-40
          w-[250px] md:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:flex`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="font-bold text-indigo-600 text-2xl">Chat Sync</h2>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 gap-3 flex flex-col overflow-y-auto">
          {links.map((link) => (
            <NavBtn key={link.href} {...link} />
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="border-t border-gray-100 flex items-center justify-between gap-2 p-3">
          <div className="flex items-center gap-2">
            <Avatar avatarUrl={user?.avatar} />
            <div className="md:block">
              <h1 className="font-bold text-base truncate">{user?.name}</h1>
              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
          <div
            onClick={handleLogOut}
            className="cursor-pointer hover:text-indigo-600 transition-colors"
          >
            <LogOutIcon size={20} />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Spacer for top bar (mobile only) */}
      <div className="h-[64px] md:hidden" />
    </>
  );
};

export default SideBar;

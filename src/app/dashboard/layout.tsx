"use client";
import { FC, ReactNode, useEffect } from "react";
import Link from "next/link";
import { useUserStore } from "@/lib/userStore";

import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useSocket } from "../hooks/socketContext";
import sideBar from "@/Components/sideBar";
import SideBar from "@/Components/sideBar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    getUserInfo();
  }, []);



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
      {user?.id && <SideBar/>}
      {/* Main content */}
      <main className="flex-1 bg-white text-black ml-[250px] min-h-screen">
        {children}
      </main>
    </div>
  );
}

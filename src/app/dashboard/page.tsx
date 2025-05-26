"use client"
import { useUserStore } from "@/lib/userStore";
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const {user} = useUserStore();
 
  return (
 <>
      <Toaster position="top-right" />

      <h1>Hello , {user?.name}</h1>
      
 </>
  );
}

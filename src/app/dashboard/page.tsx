"use client"
import { useUserStore } from "@/lib/userStore";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const {user,setUser} = useUserStore();
  const router = useRouter();

  useEffect(()=>{
    getUserInfo()
  },[])

  const getUserInfo = async () => {
     try {
      const res = await axios.get("/api/auth/me",{withCredentials: true});
      const {_id,firstName,lastName,avatar} = res.data.user;
      const userData = {
        id: _id,
        name: firstName+lastName,
        avatar
      }
      setUser(userData)
    } catch (error: any) {
      console.log(error)
      if(error.status == 401){
        router.push("/login")
      }
    }
  }

  return (
 <>
      <Toaster position="top-right" />

      <h1>Hello , {user?.name}</h1>
      
 </>
  );
}

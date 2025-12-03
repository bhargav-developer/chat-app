'use client'

import Avatar from '@/Components/Avatar'
import SearchUsers from '@/Components/SearchUsers'
import { useSocketStore } from '@/lib/socketStore'
import { useUsersStore } from '@/lib/usersStore'
import { useUserStore } from '@/lib/userStore'
import axios from 'axios'
import { ChevronRight, CircleXIcon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'


interface Chat {
  userId: string;
  firstName: string;
  avatar: string;
  lastMessage: string;
  timeStamp: string;
}


const Page = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [recentChats, setRecentChats] = useState<Chat[]>([]);
  const socket = useSocketStore((state) => state.socket);

  interface userI {
    _id: string,
    firstName: string,
    email: String,
    avatar: string,
    online?: boolean,
    lastSeen?: Date,
  }

  const { user } = useUserStore();
  const usersId = []
  const socketUrl: string | undefined = process.env.NEXT_PUBLIC_SOCKET; 



  useEffect(() => {
    if (user) {
      findRecentChats();
    }
  }, [socket])


  const router = useRouter();
  const { statusMap, setStatus } = useUsersStore();



  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (data: { senderId: string; content: string; timestamp: string }) => {
      console.log("Received message:", data);
      await findRecentChats();
    };


    socket.on("update_users", (data) => {
      Object.entries(data).forEach(([userId, statusData]) => {
        setStatus(userId, statusData);
      });
    });

    socket.on('receive-message', handleMessage);

    return () => {
       socket.off('update_users');
      socket.off('receive-message', handleMessage);
    };
  }, [socket]);

  const findRecentChats = async () => {
    try{
      const res = await axios.get(`${socketUrl}/messages/chats`, {
        params: {
          userId: user?.id
        }
      })
      const data = await res.data;
      if(data){
        setRecentChats(data)
        console.log("got the message dude")
      }
    }catch(err){
      console.log("lol ",err)
      toast.error("an error occured , try after some time")
    }
  }



  return (
    <>
      <div className='border-b border-gray-100'>
        <div className='px-2 mb-4 m-2'>
          <div className='flex justify-between'>
            <h1 className='font-bold text-xl p-3'>Chat List</h1>
            <div
              className='bg-indigo-500 flex justify-center items-center m-2 p-2 cursor-pointer rounded-xl text-white'
              onClick={() => setShowModal(true)}
            >
              <PlusIcon />
            </div>
          </div>
          <div className='px-4 m-2'>
            <input type="text" placeholder='Search convo' className='p-2 w-full rounded-md border border-gray-300' />
          </div>
        </div>
      </div>


      {recentChats && recentChats.map((chat, index) => (
        <div
          key={chat.userId || index}  // Prefer a unique ID over index if available
          className="flex p-5 border-b hover:bg-indigo-100 bg-theme cursor-pointer border-gray-100"
          onClick={() => router.push(`./chats/${chat.userId}`)}
        > 
          <div className="flex justify-center items-center">
            <Avatar avatarUrl={chat.avatar} isOnline={statusMap.get(chat.userId)?.online} />
          </div>
          <div className="flex flex-col justify-center px-2 ml-4 text-left">
            <h1 className="font-bold w-full">
              {chat.firstName} {chat.userId === user?.id && "(you)"}
            </h1>
            <p className="text-gray-500 truncate max-w-[200px] md:max-w-[400px] text-sm w-full truncate">
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}


{showModal && <SearchUsers isOpen={showModal} onClose={() => setShowModal(!showModal)} />}

    </>
  )
}

export default Page

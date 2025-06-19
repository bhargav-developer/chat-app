'use client'

import Avatar from '@/Components/Avatar'
import { useSocketStore } from '@/lib/socketStore'
import { useUserStore } from '@/lib/userStore'
import axios from 'axios'
import { CircleXIcon, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Chat {
  userId: string;
  firstName: string;
  avatar: string;
  lastMessage: string;
  timeStamp: string;
}


const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [chats, setChats] = useState<Chat[]>([]);
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

  const [contacts, setContacts] = useState<userI[]>([])

  const [query, setQuery] = useState<string>("")




  useEffect(() => {
    if (query.length > 1) {
      const delayDebounce = setTimeout(async () => {
        const res = await axios.post("/api/profile/search-profile", { query });
        if (res.status === 200) {
          const data = res.data.Users
          setContacts(data)
        }
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setContacts([])
    }
  }, [query])

  useEffect(() => {
    if (user) {
      findRecentChats();
    }
  }, [socket])


  const router = useRouter();
  const [onlineMap, setOnlineMap] = useState<Map<string, boolean>>(new Map());


  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: { senderId: string; content: string; timestamp: string }) => {
      console.log("Received message:", data);
      findRecentChats();
    };


    socket.on("update_users", (data) => {
      const map = new Map(Object.entries(data));
      setOnlineMap(map);

    });

    socket.on('receive-message', handleMessage);

    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, [socket]);

  const findRecentChats = async () => {
    const res = await axios.get("http://localhost:4000/messages/chats", {
      params: {
        userId: user?.id
      }
    })
    console.log("sent req")
    const data = res.data;
    setChats(data)
  }

  const handleContactClick = (id: string) => router.push(`chats/${id}`);


  useEffect(() => {
    if (isModalOpen) {
      setShowModal(true)
    } else {
      const timeout = setTimeout(() => setShowModal(false), 300)
      return () => clearTimeout(timeout)
    }
  }, [isModalOpen])

  return (
    <>
      <div className='border-b border-gray-100'>
        <div className='px-2 mb-4 m-2'>
          <div className='flex justify-between'>
            <h1 className='font-bold text-xl p-3'>Chat List</h1>
            <div
              className='bg-indigo-500 flex justify-center items-center m-2 p-2 cursor-pointer rounded-xl text-white'
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon />
            </div>
          </div>
          <div className='px-4 m-2'>
            <input type="text" placeholder='Search convo' className='p-2 w-full rounded-md border border-gray-300' />
          </div>
        </div>
      </div>


      {chats && chats.map((chat, index) => (
        <div
          key={chat.userId || index}  // Prefer a unique ID over index if available
          className="flex p-5 border-b hover:bg-indigo-100 bg-theme cursor-pointer border-gray-100"
          onClick={() => router.push(`./chats/${chat.userId}`)}
        >
          <div className="flex justify-center items-center">
            <Avatar avatarUrl={chat.avatar} isOnline={onlineMap.get(chat.userId)} />
          </div>
          <div className="flex flex-col justify-center px-2 ml-4 text-left">
            <h1 className="font-bold w-full">
              {chat.firstName} {chat.userId === user?.id && "(you)"}
            </h1>
            <p className="text-gray-500 text-sm w-full truncate">
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}











      {showModal && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white text-black rounded-2xl transition-all duration-300 ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex border-b border-gray-200 p-5 justify-between items-center'>
              <h1 className='text-xl font-semibold'>Start New Chat</h1>
              <CircleXIcon
                className='cursor-pointer'
                onClick={() => setIsModalOpen(false)}
              />
            </div>
            <div className='p-6'>
              <h2 className='text-gray-700'>Search contacts</h2>
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='p-2 rounded-xl mt-1 border focus:outline-none border-gray-200 w-full'
                placeholder='Enter name or email'
              />
            </div>
            <div className='mb-6'>
              {
                contacts &&
                contacts.map((e, index) => {
                  return <div key={index}
                    onClick={() => handleContactClick(e._id)}
                    className='flex gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-2xl mx-6 my-2'>
                    <img src={e.avatar} alt=":(" className='w-11 h-11' />
                    <div className=''>
                      <h1 className='font-bold'>{e.firstName}</h1>
                      <p className='text-gray-600 text-sm'>{e.email}</p>
                    </div>
                  </div>
                })
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Page

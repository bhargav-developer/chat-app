'use client'

import axios from 'axios'
import { CircleXIcon, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)

  interface userI{
    _id: Number,
    firstName: string,
    email: String,
    avatar: string,
  }

  const [contacts,setContacts] = useState<userI[]>([])

  const [query,setQuery] = useState<string>("")

    useEffect(() => {
    if (query.length > 1) {
     const delayDebounce = setTimeout(async () => {
      const res = await axios.post("api/profile/search-profile",{query});
      if(res.status === 200){
        const data = res.data.Users
        setContacts(data)
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
    }  else{
      setContacts([])
    }
  }, [query])




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
      <div className='px-1'>
        <div className='flex justify-between'>
          <h1 className='font-bold text-xl p-3'>Chat List</h1>
          <div
            className='bg-indigo-500 flex justify-center items-center m-2 p-2 cursor-pointer rounded-xl text-white'
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon />
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white text-black rounded-2xl transition-all duration-300 ${
              isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
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
                    contacts.map((e,index) => {
                  return <div key={index} className='flex gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-2xl mx-6 my-2'>
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

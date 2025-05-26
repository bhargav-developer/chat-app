'use client'
import axios from 'axios'
import { Link2Icon, SendHorizontalIcon, SmileIcon } from 'lucide-react'
import * as React from 'react'

function page({ params }) {
  const { id } = React.use(params)
  const [user, setUser] = React.useState({})

  React.useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const res = await axios.post("/api/profile/getSingleProfile", { userId: id })
    if (res.status === 200) {
      const user = res.data.Users;

      setUser(user)
    }
  }

  return <>
    <div className='flex h-full flex-col'>
      <div className='flex p-4 border-b border-gray-100 justify-between'>
        <div className='flex gap-3'>
          <div className='relative'>
            <img className='h-12 w-12' src={user?.avatar} alt="" />
            <div className='bg-green-500 absolute bottom-1 right-[3px] border border-white rounded-[50%] h-3 w-3'></div>
          </div>
          <div>
            <h1>{`${user.firstName} ${user.lastName}`}</h1>
            <p className='text-gray-600'>online</p>
          </div>
        </div>
        <div className='flex gap-2'>
          <h1>op</h1>
          <h1>op</h1>
          <h1>op</h1>
        </div>
      </div>

      <div className='bg-gray-50 flex-1 flex'>
      </div>

      <div className='border-t p-3 gap-3 mb-5 flex  border-gray-100 items-center w-full'>
<button><Link2Icon/></button>
<input type="text" className='border border-gray-400 flex-1 p-2 rounded-xl' placeholder='Type Your Message' />
<button><SmileIcon/></button>
<button className='bg-indigo-600 p-3 cursor-pointer rounded-2xl'><SendHorizontalIcon className='text-white'/></button>

      </div>

    </div>
  </>
}

export default page
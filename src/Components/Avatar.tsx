import React, { useEffect } from 'react'

interface prop {
    avatarUrl: string | undefined,
    altTitle?: string,
    isOnline?: boolean
}



const Avatar: React.FC<prop> = ({ avatarUrl,
    altTitle,
    isOnline = false }) => {
    return (
        <>
            <div className='relative'>
                <img className='h-12 w-12' src={avatarUrl} alt={altTitle} />
                {
                    isOnline &&
                    <div className='bg-green-500 absolute bottom-1 right-[3px] border border-white rounded-[50%] h-3 w-3'></div>
                }
            </div>
        </>
    )
}

export default Avatar
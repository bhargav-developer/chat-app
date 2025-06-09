'use client'
import { DeleteIcon, FileIcon, TrashIcon, UploadIcon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const FileUpload = () => {
    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center">
            <div className="bg-white p-12 gap-12  flex rounded-3xl shadow-2xl">
                <div className='p-12 border-indigo-500 rounded-xl gap-3 flex items-center justify-center flex-col border-2 border-dashed'>
                    <UploadIcon className='text-indigo-500 w-12 h-12' />
                    <h1 className='text-center'>Drag and drop files to upload <br />or</h1>
                    <button className='bg-indigo-500 cursor-pointer rounded text-white hover:bg-indigo-600 p-2'>Browse</button>
                </div>
                <div className='h-full w-full'>
                    <h1 className='font-semibold text-xl'>Uplaoded files</h1>
                    <div className='p-8 overflow-auto'>
                        <div className='flex w-full gap-2 items-center justify-between'>
                            <FileIcon className='w-8 h-8 text-blue-500' />
                            <h1 className='flex-1'>Hello</h1>
                            <TrashIcon className='w-5 h-5 cursor-pointer text-red-500' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileUpload
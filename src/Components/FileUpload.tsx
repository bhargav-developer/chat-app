'use client';
import { useSocket } from '@/app/hooks/socketContext';
import { useSocketStore } from '@/lib/socketStore';
import {
  FileIcon,
  TrashIcon,
  UploadIcon,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface FileUploadProps {
  onClose: () => void;
  reciverId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose,reciverId }) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [progress, setProgress] = useState<Number>(0);
    const socket = useSocketStore((state) => state.socket);

    useEffect(() => {
      if(!socket) return
    
      return () => {
        socket.off()
      }
    }, [socket])
    

  const handleBrowseClick = () => {
    inputFileRef.current?.click();
  };
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!socket) return; 
  const fileList = e.target.files;
  if (fileList && fileList.length > 0) {
    const fileArray = Array.from(fileList);
    setFiles(fileArray);
    const file = fileArray[0]
     const reader = file.stream().getReader();


    socket.emit("file-meta",{
      name: file.name,
      size: file.size,
      reciverId
    })

    

      let sent = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                sent += value.length;
                setProgress(Math.round((sent / file.size) * 100));
                socket.emit("file-chunk",{
                  fileData: value,
                  reciverId
                })
                
            }
  }
};


 const formatFileSize = (size: number) => {
  const mb = size / 1_000_000;

  
  return `${mb.toFixed(2)} MB`;
};

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white relative w-full max-w-4xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8">

        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-[-30px] right-[-30px] text-white border border-white rounded transition-all hover:rounded-[50%]  duration-300 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Upload Area */}
        <div className="flex-1 border-2 border-dashed border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-4 p-6">
          <UploadIcon className="text-indigo-500 w-10 h-10" />
          <p className="text-center text-gray-700 font-medium">
            Drag and drop files to upload <br className="hidden md:block" />
            or
          </p>
          <button
            onClick={handleBrowseClick}
            className="bg-indigo-500 hover:bg-indigo-600 transition text-white font-semibold px-4 py-2 rounded-lg"
          >
            Browse
          </button>
          <input
            type="file"
            multiple
            className="hidden"
            ref={inputFileRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Uploaded Files */}
        <div className="flex-1 overflow-auto max-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg md:text-xl">Uploaded Files</h2>
            {files.length > 0 && (
              <span className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold">
                {files.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="text-blue-500 w-8 h-8" />
                  <div className="truncate">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <TrashIcon
                  onClick={() =>
                    setFiles((prev) => prev.filter((f) => f.name !== file.name))
                  }
                  className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer transition"
                />
              </div>
            ))}
            {files.length === 0 && (
              <p className="text-gray-400  italic">No files uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

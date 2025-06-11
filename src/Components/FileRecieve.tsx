import { useSocketStore } from '@/lib/socketStore';
import { FileIcon, TrashIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface FileUploadProps {
  onClose: () => void;
}

interface FuckIt {
    file: string;
    size: number;
}



const FileRecieve: React.FC<FileUploadProps> = ({ onClose }) => {
  const [files, setFiles] = useState<FuckIt[]>([]);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {

    if (!socket) return

    socket.on("meta-transfer", (data) => {
      setFiles(data)
      console.log(data)
    })

    socket.on("recieve-file-chunk",(data)=>{
        console.log("file chunk",data)
    })

    return () => {
      socket.off("meta-transfer")
    }
  }, [socket])


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
          <X
            className="w-5 h-5" />
        </button>



        {/* Uploaded Files */}
        <div className="flex-1 overflow-auto max-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg md:text-xl">Recieved Files</h2>
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
                    <p className="font-medium truncate">{file.file}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <TrashIcon
                
                  className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer transition"
                />
              </div>
            ))}
            {files.length === 0 && (
              <p className="text-gray-400  italic">No files recieved yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileRecieve
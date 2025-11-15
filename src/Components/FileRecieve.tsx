import { useSocketStore } from '@/lib/socketStore';
import { FileIcon, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

// Removed unused and non-browser imports.

interface FileUploadProps {
  onClose: () => void;
}

interface ReceivedFile {
  file: string;
  size: number;
  progress: number;
  receivedBytes: number;
  fileType?: string;
}

const FileRecieve: React.FC<FileUploadProps> = ({ onClose }) => {
  const socket = useSocketStore((state) => state.socket);

  const [files, setFiles] = useState<ReceivedFile[]>([]);
  const [progress,setProgress] = useState<number>(0)
  // Using useRef to store the binary chunks Map, which prevents unnecessary re-renders.
  const fileChunksRef = useRef<Map<string, Uint8Array[]>>(new Map());

  useEffect(() => {
    if (!socket) return;

    const fileChunks = fileChunksRef.current; // Get the current map reference

    
    socket.on("meta-transfer", (data: any[]) => {
      const fileData = data.map((f: any) => {
      
        fileChunks.set(f.file, []); 
        return {
          file: f.file,
          size: f.size,
          fileType: f.fileType,
          progress: 0,
          receivedBytes: 0
        };
      });
      setFiles(fileData);
    });

   socket.on("recieve-file-chunk", (data: any) => {
  const { file, chunk } = data;
  const arrChunk = new Uint8Array(chunk);

  const chunks = fileChunks.get(file);
  console.log("is chunks",fileChunks)
  if (!chunks) return console.warn("Chunk received before metadata:", file);

  chunks.push(arrChunk);



  setFiles(prev =>
    prev.map(f =>
      f.file === file
        ? {
            ...f,
            receivedBytes: f.receivedBytes + arrChunk.byteLength,
            progress: Math.round(((f.receivedBytes + arrChunk.byteLength) / f.size) * 100),
          }
        : f
    )
  );
});


socket.on("file-transfer-end", (data: any) => {
 
  const { file, fileType } = data;
  const chunks = fileChunks.get(file);


  const blob = new Blob(chunks as BlobPart[], { type: fileType || "application/octet-stream" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file;
  a.click();

  URL.revokeObjectURL(a.href);
  fileChunks.delete(file);

  setFiles(prev => prev.filter(f => f.file !== file));
});

    // Cleanup function to remove event listeners on component unmount
    return () => {
      socket.off("meta-transfer");
      socket.off("recieve-file-chunk");
      socket.off("file-transfer-end");
    };
  }, [socket]); // Depend on socket to re-run effect if it changes

  // Helper function to format bytes to MB
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
          className="absolute cursor-pointer top-[-30px] right-[-30px] text-white border border-white rounded transition-all hover:rounded-[50%] duration-300 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-auto max-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg md:text-xl">Received Files</h2>
            {files.length > 0 && (
              <span className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold">
                {files.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="flex flex-col gap-1 p-3 border-b">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="text-blue-500 w-8 h-8" />
                  <div className="truncate">
                    <p className="font-medium truncate">{file.file}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{file.progress}%</p>
              </div>
            ))}

            {files.length === 0 && (
              <p className="text-gray-400 italic">No files received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileRecieve;
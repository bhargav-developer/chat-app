import { fileTransferStore } from '@/lib/fileTransferStore';
import { useSocketStore } from '@/lib/socketStore';
import { FileIcon, X } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

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
  const fileChunksRef = useRef<Map<string, Uint8Array[]>>(new Map());
  const { roomId } = fileTransferStore();
  useEffect(() => {
    if (!socket) return;

    const fileChunks = new Map<string, Uint8Array[]>();
    const fileInfo = new Map<string, { size: number; type: string; roomId: string }>();

    // --- Receive metadata ---
    socket.on("meta-transfer", ({ fileName, size, fileType, roomId }) => {
      fileChunks.set(fileName, []);
      fileInfo.set(fileName, { size, type: fileType, roomId });

      setFiles(prev => [...prev, {
        file: fileName,
        size,
        fileType,
        progress: 0,
        receivedBytes: 0,
      }]);
    });

    // --- Receive chunks ---
    socket.on("receive-file-chunk", ({ fileName, chunk }) => {
      const arr = new Uint8Array(chunk);
      fileChunks.get(fileName)?.push(arr);
      socket.emit("chunk-ack",{roomId})
      setFiles(prev => prev.map(f =>
        f.file === fileName
          ? {
            ...f,
            receivedBytes: f.receivedBytes + arr.length,
            progress: Math.round(
              ((f.receivedBytes + arr.length) / f.size) * 100
            ),
          }
          : f
      ));

    });

    // --- File done ---
    socket.on("file-transfer-end", ({ fileName }) => {
      const chunks = fileChunks.get(fileName);
      const info = fileInfo.get(fileName);
      if (!chunks || !info) return;

      const blob = new Blob(chunks as BlobPart[], { type: info.type });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);
      fileChunks.delete(fileName);
      fileInfo.delete(fileName);
    });


    socket.on("close-file-transfer", () => {
      if (!socket) return
      onClose()
    })

    return () => {
      socket.off("meta-transfer");
      socket.off("receive-file-chunk");
      socket.off("file-transfer-end");
      socket.off("close-file-transfer")
    };
  }, [socket]);


  // Format size helper
  const formatSize = (size: number) => (size / 1_000_000).toFixed(2) + " MB";

  const handleClose = () => {
    if (!socket) return;
    socket.emit("close-file-transfer", { roomId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white relative w-full max-w-4xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
        <button onClick={handleClose} aria-label="Close upload window" className="absolute top-[-50px] right-[-10px] md:top-[-30px] md:right-[-30px] text-white border cursor-pointer border-white rounded p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-auto max-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg md:text-xl">Received Files</h2>
            {files.length > 0 && (
              <span className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold">
                {files.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {files && files.map((file, index) => (
              <div key={index} className="flex flex-col gap-1 p-3 border-b">
                <div className="flex items-center gap-3 truncate">
                  <FileIcon className="text-blue-500 w-8 h-8" />
                  <div className="truncate">
                    <p className="font-medium truncate">{file.file}</p>
                    <p className="text-sm text-gray-500">
                      {formatSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{ width: `${file.progress}%` }}
                  ></div>
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

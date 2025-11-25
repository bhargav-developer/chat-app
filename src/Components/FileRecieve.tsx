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
    console.log(files)
  }, [files])

  useEffect(() => {
    if (!socket) return;

    const fileChunks = fileChunksRef.current;

    // --- 1. FIXED: meta-transfer now expects single object ---
    socket.on("meta-transfer", (data: any) => {
      const { fileName, size, fileType } = data;
      console.log("got meta data", fileName, size, fileType)

      fileChunks.set(fileName, []);

      setFiles((prev) => [...prev,
      {
        file: fileName,
        size,
        fileType,
        progress: 0,
        receivedBytes: 0,
      },
      ]);
    });

    // --- 2. FIXED: corrected event spelling ---
  socket.on("receive-file-chunk", (data: any) => {
  const { fileName, chunk } = data;
  const arrChunk = new Uint8Array(chunk);

  const chunks = fileChunks.get(fileName);
  if (!chunks) return;

  chunks.push(arrChunk);

  // UPDATE PROGRESS UI
  setFiles(prev =>
    prev.map(f =>
      f.file === fileName
        ? {
            ...f,
            receivedBytes: f.receivedBytes + arrChunk.byteLength,
            progress: Math.round(
              ((f.receivedBytes + arrChunk.byteLength) / f.size) * 100
            ),
          }
        : f
    )
  );

  socket.emit("chunk-ack", { fileName,roomId }); // 👈 SEND ACK
});


    // --- 3. FILE END ---
    socket.on("file-transfer-end", (data: any) => {
      const { fileName, fileType } = data;

      const chunks = fileChunks.get(fileName);
      if (!chunks) return;

      const blob = new Blob(chunks as BlobPart[], { type: fileType || "application/octet-stream" });

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(a.href);

      fileChunks.delete(fileName);

      // setFiles((prev) => prev.filter((f) => f.file !== fileName));
    });

    // --- 4. CLOSE TRANSFER ---
    socket.on("close-file-transfer", () => {
      onClose();
    });

    return () => {
      socket.off("meta-transfer");
      socket.off("receive-file-chunk");
      socket.off("file-transfer-end");
      socket.off("close-file-transfer");
    };
  }, [socket]);

  useEffect(() => {
    console.log(files)
  }, [files])

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
        <button
          onClick={handleClose}
          className="absolute cursor-pointer top-[-50px] right-[-10px] md:top-[-30px] md:right-[-30px] text-white border border-white rounded transition-all hover:rounded-[50%] duration-300 p-1"
        >
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

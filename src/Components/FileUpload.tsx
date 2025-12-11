import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FileIcon, UploadIcon, TrashIcon, X } from 'lucide-react';
import { useSocketStore } from '@/lib/socketStore';
import { fileTransferStore } from '@/lib/fileTransferStore';

const CHUNK_SIZE = 1024 * 1024;   // 1 MB

interface FileUploadProps {
  onClose: () => void;
  receiverId: string;
}

interface FileUploadStatus {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  roomId?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose, receiverId }) => {
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const socket = useSocketStore((state) => state.socket);
  const { roomId } = fileTransferStore();


  const updateFileStatus = useCallback(
    (id: string, updates: Partial<FileUploadStatus>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );
  const CHUNK_SIZE = 1024 * 1024 * 2; // 2MB per chunk (good for large files)
  const ACK_INTERVAL = 32;            // send ACK every 32 chunks

  const startFileUpload = async (uploadStatus: FileUploadStatus) => {
    if (!socket) return;

    const { file, id } = uploadStatus;

    // Send file metadata
    socket.emit("file-meta", {
      roomId,
      fileName: file.name,
      fileType: file.type,
      size: file.size,
    });

    let offset = 0;
    let seq = 0;
    let sentBytes = 0;

    updateFileStatus(id, { status: "uploading" });

    // Wait for ack
    const waitForAck = () =>
      new Promise(resolve => socket.once("chunk-ack", resolve));

    while (socket.connected && offset < file.size) {
      // -----------------------
      // 🧠 Backpressure control
      // -----------------------
      const ws = (socket.io.engine.transport as any)?.ws;
      if (ws && ws.bufferedAmount > 10 * 1024 * 1024) {
        await new Promise(res => setTimeout(res, 5));
        continue;
      }

      if (ws && ws.bufferedAmount > 10 * 1024 * 1024) {
        // If more than 10MB waiting, slow down sending
        await new Promise(res => setTimeout(res, 5));
        continue;
      }

      // Next slice of file
      const nextOffset = offset + CHUNK_SIZE;
      const chunk = await file.slice(offset, nextOffset).arrayBuffer();

      // Send chunk
      socket.emit("send-file-chunk", {
        roomId,
        fileName: file.name,
        seq,
        buffer: chunk,
      });

      // Update counters
      offset = nextOffset;
      seq++;
      sentBytes += chunk.byteLength;

      // Update UI
      updateFileStatus(id, {
        progress: Math.round((sentBytes / file.size) * 100),
      });

      // -----------------------
      // 🧠 Only pause every N chunks
      // -----------------------
      if (seq % ACK_INTERVAL === 0) {
        await waitForAck(); // wait for receiver to catch up
      }
    }

    // Upload ends
    socket.emit("file-end", {
      roomId,
      fileName: file.name,
      fileType: file.type,
    });

    updateFileStatus(id, { status: "completed" });
  };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const newUploads: FileUploadStatus[] = selectedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...newUploads]);

    newUploads.forEach((upload) => startFileUpload(upload));

    if (inputFileRef.current) inputFileRef.current.value = '';
  };

  const handleBrowseClick = () => inputFileRef.current?.click();
  const handleRemoveFile = (id: string) =>
    setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleClose = () => {
    if (socket) {
      console.log("sent colse req")
      socket.emit("close-file-transfer", { roomId })
    }
    onClose();
  };

  const formatFileSize = (size: number) => `${(size / 1_000_000).toFixed(2)} MB`;
  const getProgressColor = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'uploading': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="
      bg-white relative w-full 
      max-w-5xl   /* Wider than before */
      rounded-3xl shadow-2xl 
      p-6 md:p-10 
      flex flex-col md:flex-row 
      gap-10 
      transition-all
    ">
      
      {/* macOS style window buttons */}
      <div className="absolute top-4 left-4 flex gap-2">
        {/* Close */}
        <button
          onClick={handleClose}
          className="
            w-4 h-4 rounded-full bg-[#ff5f57]
            hover:bg-[#ff2d1a] transition
            border border-black/10
          "
        />

        {/* Minimize (no function, just UI) */}
        <div
          className="
            w-4 h-4 rounded-full bg-[#ffbd2e]
            hover:bg-[#ffb300] transition
            border border-black/10
          "
        />
      </div>

      {/* Upload Area */}
      <div className="flex-1 border-2 border-dashed border-indigo-500 rounded-xl 
                      flex flex-col items-center justify-center gap-6 p-6 md:p-10">
        <UploadIcon className="text-indigo-500 w-12 h-12" />
        <p className="text-center text-gray-700 font-medium text-lg">
          Drag and drop files to upload <br className="hidden md:block" /> or
        </p>

        <button
          onClick={handleBrowseClick}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg text-lg"
        >
          Browse
        </button>

        <input type="file" multiple className="hidden" ref={inputFileRef} onChange={handleFileChange} />
      </div>

      {/* Upload Status */}
      <div className="flex-1 overflow-auto max-h-[360px] md:max-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-xl md:text-2xl">Upload Status</h2>
          {files.length > 0 && (
            <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
              {files.length}
            </span>
          )}
        </div>

        <div className="space-y-5">
          {files.map((f) => (
            <div key={f.id} className="flex flex-col gap-2 p-4 border-b border-gray-200 rounded-lg">
              <div className="flex items-center justify-between gap-3 overflow-hidden">
                <div className="flex items-center gap-4 overflow-hidden">
                  <FileIcon className="text-blue-500 w-10 h-10 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-medium truncate text-lg">{f.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(f.file.size / 1_000_000).toFixed(2)} MB
                      <span className={`
                          ml-3 px-3 py-1 text-xs font-semibold rounded-full text-white
                          ${f.status === 'completed' ? 'bg-green-500' :
                            f.status === 'uploading' ? 'bg-blue-500' :
                            'bg-yellow-500'}
                        `}
                      >
                        {f.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>

                {f.status !== "uploading" && (
                  <TrashIcon
                    onClick={() => handleRemoveFile(f.id)}
                    className="w-6 h-6 text-red-500 hover:text-red-600 cursor-pointer"
                  />
                )}
              </div>

              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className={`
                    h-full rounded transition-all duration-300
                    ${f.status === "completed" ? "bg-green-500" : "bg-blue-500"}
                  `}
                  style={{ width: `${f.progress}%` }}
                />
              </div>

              <p className="text-sm text-gray-600 text-right">{f.progress}%</p>
            </div>
          ))}

          {files.length === 0 && (
            <p className="text-gray-400 italic text-lg">No files selected yet.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default FileUpload;

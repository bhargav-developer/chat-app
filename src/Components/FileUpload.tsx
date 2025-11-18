'use client';
import { fileTransferStore } from '@/lib/fileTransferStore';
// FIX: Using relative path to resolve compilation error
import { useSocketStore } from '../lib/socketStore';
import {
  FileIcon,
  TrashIcon,
  UploadIcon,
  X,
} from 'lucide-react';
import React, { useRef, useState, useCallback, useEffect } from 'react';
// Removed unused imports: useSocket, axios, useEffect

// Define the chunk size (e.g., 64KB)
const CHUNK_SIZE = 1024 * 64;

interface FileUploadProps {
  onClose: () => void;
  reciverId: string;
}

// Interface to manage the state of each file being uploaded
interface FileUploadStatus {
  id: string; // Unique ID (e.g., file.name + timestamp)
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
}

const FileUpload: React.FC<FileUploadProps> = ({ onClose, reciverId }) => {
  const [files, setFiles] = useState<FileUploadStatus[]>([]);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const socket = useSocketStore((state) => state.socket);
  const {roomId} = fileTransferStore();

  const handleBrowseClick = () => {
    inputFileRef.current?.click();
  };

  useEffect(() => {
    if (!socket) return
  socket.on("close-file-transfer", () => {
         console.log("got a req to close on sender")
      onClose()
    })
  }, [socket])

  const updateFileStatus = useCallback(
    (id: string, updates: Partial<FileUploadStatus>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const startFileUpload = async (uploadStatus: FileUploadStatus) => {
    if (!socket) {
      updateFileStatus(uploadStatus.id, { status: 'failed' });
      return;
    }
    const { file, id } = uploadStatus;

    let offset = 0;

    // 1. Send file metadata (using unique ID 'id' as 'name' for tracking)
    socket.emit("file-meta", {
      name: file.name,
      size: file.size,
      fileType: file.type,
      reciverId,
    });

    updateFileStatus(id, { status: 'uploading' });

    // 2. Loop through file chunks
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onload = () => {
          const buffer = new Uint8Array(reader.result as ArrayBuffer);

          // Send the chunk over the socket
          socket.emit("send-file-chunk", {
            name: file.name, // Use the unique ID for receiver tracking
            buffer,
            reciverId,
          });

          // Update progress
          offset += buffer.byteLength;
          const progress = Math.min(100, Math.round((offset / file.size) * 100));

          updateFileStatus(id, { progress });
          resolve();
        };
        reader.onerror = () => {
          updateFileStatus(id, { status: 'failed' });
          resolve();
        };
        reader.readAsArrayBuffer(chunk);
      });

      // Stop transfer if failure is detected
      const currentStatus = files.find(f => f.id === id)?.status;
      if (currentStatus === 'failed') break;
    }

    // 3. Send transfer end signal
    if (offset >= file.size) {
      socket.emit("file-end", {
        name: id,
        fileType: file.type,
        reciverId,
      });
      updateFileStatus(id, { status: 'completed' });
    }
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Create FileUploadStatus objects for the selected files
    const newUploads: FileUploadStatus[] = selectedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}`, // Unique ID for tracking
      file,
      progress: 0,
      status: 'pending',
    }));

    // Add them to the state
    setFiles((prev) => [...prev, ...newUploads]);

    // Start upload for each file
    for (const uploadStatus of newUploads) {
      // Execute the async upload function without awaiting to allow concurrent uploads
      startFileUpload(uploadStatus);
    }

    // Clear the input value so the same file can be selected again
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    // In a real application, you might want to send a cancellation signal to the receiver here.
  };

  const formatFileSize = (size: number) => {
    const mb = size / 1_000_000;
    return `${mb.toFixed(2)} MB`;
  };

  const getProgressColor = (status: FileUploadStatus['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'uploading':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-yellow-500';
    }
  };

  const handleClose = () => {
    if(!socket) return
    socket.emit("close-file-transfer",{roomId})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white relative w-full max-w-4xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close upload window"
          className="absolute cursor-pointer top-[-30px] right-[-30px] text-white border border-white rounded transition-all hover:rounded-[50%] duration-300 p-1"
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

        {/* Uploaded Files Status */}
        <div className="flex-1 overflow-auto max-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg md:text-xl">Upload Status</h2>
            {files.length > 0 && (
              <span className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold">
                {files.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {files.map((statusItem) => (
              <div
                key={statusItem.id}
                className="flex flex-col gap-1 p-3 border-b border-gray-100"
              >
                <div className="flex items-center justify-between gap-3 overflow-hidden">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileIcon className="text-blue-500 w-8 h-8 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-medium truncate">{statusItem.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(statusItem.file.size)}
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getProgressColor(statusItem.status)} text-white`}>
                          {statusItem.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Remove button (only show for pending/failed files) */}
                  {statusItem.status !== 'uploading' && (
                    <TrashIcon
                      onClick={() => handleRemoveFile(statusItem.id)}
                      className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer transition flex-shrink-0"
                      aria-label={`Remove ${statusItem.file.name}`}
                    />
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div
                    className={`h-full rounded ${getProgressColor(statusItem.status)} transition-all duration-300`}
                    style={{ width: `${statusItem.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 self-end">
                  {statusItem.progress}%
                </p>
              </div>
            ))}

            {files.length === 0 && (
              <p className="text-gray-400 italic">No files selected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
import React, { useState, useRef, useCallback } from 'react';
import { FileIcon, UploadIcon, TrashIcon, X } from 'lucide-react';
import { useSocketStore } from '@/lib/socketStore';
import { fileTransferStore } from '@/lib/fileTransferStore';

const CHUNK_SIZE = 1024 * 64;

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

    // --- Request room from server ---
    socket.emit('sender-file-transfer-req', {
      senderId: socket.id,
      receiverId,
      name: file.name,
    });

    socket.on("file-transfer-start",()=>{
      console.log("req for upload accepted")
    })

    const roomId: string = await new Promise((resolve) => {
      socket.once('file-transfer-start', (data: any) => resolve(data.roomId));
    });

    updateFileStatus(id, { status: 'uploading', roomId });

    // --- Send file metadata ---
    socket.emit('file-meta', {
      fileName: file.name,
      size: file.size,
      fileType: file.type,
      roomId,
    });

    // --- Send file chunks ---
    let offset = 0;
    while (offset < file.size) {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onload = () => {
          const buffer = new Uint8Array(reader.result as ArrayBuffer);
          socket.emit('send-file-chunk', {
            buffer,
            fileName: file.name,
            roomId,
          });
          offset += buffer.byteLength;
          const progress = Math.min(100, Math.round((offset / file.size) * 100));
          updateFileStatus(id, { progress });
          resolve();
        };
        reader.onerror = () => {
          updateFileStatus(id, { status: 'failed' });
          resolve();
        };
        reader.readAsArrayBuffer(slice);
      });
    }

    // --- End transfer ---
    socket.emit('file-end', {
      fileName: file.name,
      fileType: file.type,
      roomId,
    });
    updateFileStatus(id, { status: 'completed' });
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
      files.forEach((f) => f.roomId && socket.emit('close-file-transfer', { roomId: f.roomId }));
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
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white relative w-full max-w-4xl rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
        <button onClick={handleClose} aria-label="Close upload window" className="absolute top-[-50px] right-[-10px] md:top-[-30px] md:right-[-30px] text-white border border-white rounded p-1">
          <X className="w-5 h-5" />
        </button>

        {/* Upload Area */}
        <div className="flex-1 border-2 border-dashed border-indigo-500 rounded-xl flex flex-col items-center justify-center gap-4 p-6">
          <UploadIcon className="text-indigo-500 w-10 h-10" />
          <p className="text-center text-gray-700 font-medium">
            Drag and drop files to upload <br className="hidden md:block" /> or
          </p>
          <button onClick={handleBrowseClick} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg">Browse</button>
          <input type="file" multiple className="hidden" ref={inputFileRef} onChange={handleFileChange} />
        </div>

        {/* Upload Status */}
        <div className="flex-1 overflow-auto max-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg md:text-xl">Upload Status</h2>
            {files.length > 0 && <span className="bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold">{files.length}</span>}
          </div>

          <div className="space-y-4">
            {files.map((f) => (
              <div key={f.id} className="flex flex-col gap-1 p-3 border-b border-gray-100">
                <div className="flex items-center justify-between gap-3 overflow-hidden">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileIcon className="text-blue-500 w-8 h-8 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-medium truncate">{f.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(f.file.size)}
                        <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getProgressColor(f.status)} text-white`}>
                          {f.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                  {f.status !== 'uploading' && (
                    <TrashIcon onClick={() => handleRemoveFile(f.id)} className="w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer" />
                  )}
                </div>
                <div className="w-full bg-gray-200 h-2 rounded mt-1">
                  <div className={`h-full rounded ${getProgressColor(f.status)} transition-all duration-300`} style={{ width: `${f.progress}%` }} />
                </div>
                <p className="text-xs text-gray-600 self-end">{f.progress}%</p>
              </div>
            ))}
            {files.length === 0 && <p className="text-gray-400 italic">No files selected yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

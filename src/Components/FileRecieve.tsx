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

interface FileMeta {
  fileName: string;
  fileType: string;
  size: number;
}

const FileRecieve: React.FC<FileUploadProps> = ({ onClose }) => {
  const socket = useSocketStore((s) => s.socket);
  const { roomId } = fileTransferStore();
  const [files, setFiles] = useState<ReceivedFile[]>([]);

  const fileBuffersRef = useRef<Map<string, Uint8Array[]>>(new Map());
  const fileMetaRef = useRef<Map<string, FileMeta>>(new Map());  // ✅ track meta per file

  useEffect(() => {
    if (!socket) return;

    let ackCounter = 0;

    socket.on("meta-transfer", ({ fileName, size, fileType }: FileMeta) => {
      if (!fileName) {
        console.error("Received meta-transfer with undefined fileName");
        return;
      }
      // ✅ Store meta keyed by fileName
      fileMetaRef.current.set(fileName, { fileName, fileType, size });
      fileBuffersRef.current.set(fileName, []);

      setFiles(prev => [...prev, {
        file: fileName,
        size,
        progress: 0,
        receivedBytes: 0,
        fileType
      }]);
    });

    socket.on("receive-file-chunk", async ({ fileName, chunk }: { fileName: string; chunk: ArrayBuffer }) => {
      if (!fileName || !fileBuffersRef.current.has(fileName)) {
        console.error("Received chunk for unknown file:", fileName);
        return;
      }

      const uint = new Uint8Array(chunk);
      fileBuffersRef.current.get(fileName)!.push(uint);

      setFiles(prev =>
        prev.map(f =>
          f.file === fileName
            ? {
                ...f,
                receivedBytes: f.receivedBytes + uint.length,
                progress: Math.min(100, Math.round(((f.receivedBytes + uint.length) / f.size) * 100)),
              }
            : f
        )
      );

      ackCounter++;
      if (ackCounter % 32 === 0) {
        socket.emit("chunk-ack", { roomId });
      }
    });

    socket.on("file-transfer-end", ({ fileName }: { fileName: string }) => {
      if (!fileName) {
        console.error("file-transfer-end received with undefined fileName");
        return;
      }

      const meta = fileMetaRef.current.get(fileName);
      const buffers = fileBuffersRef.current.get(fileName);

      if (!meta || !buffers) {
        console.error("Missing meta or buffers for file:", fileName);
        return;
      }

      // ✅ Use stored meta for reliable fileType + fileName
      const blob = new Blob(buffers as BlobPart[], { type: meta.fileType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = meta.fileName;  // ✅ guaranteed to not be undefined
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Cleanup
      fileBuffersRef.current.delete(fileName);
      fileMetaRef.current.delete(fileName);
    });

    socket.on("close-file-transfer", onClose);

    return () => {
      socket.off("meta-transfer");
      socket.off("receive-file-chunk");
      socket.off("file-transfer-end");
      socket.off("close-file-transfer");
    };
  }, [socket]);

  const handleClose = () => {
    socket?.emit("close-file-transfer", { roomId });
    onClose();
  };

  const formatSize = (size: number) => (size / 1_000_000).toFixed(2) + " MB";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl">
        <button onClick={handleClose} className="absolute top-[-50px] right-[-10px] text-white border border-white rounded p-1">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Receiving Files</h2>
        <div className="space-y-4 max-h-[430px] overflow-auto">
          {files.map((f, i) => (
            <div key={i} className="border-b p-3">
              <div className="flex items-center gap-3">
                <FileIcon className="w-8 h-8 text-blue-500" />
                <div className="truncate">
                  <p className="truncate">{f.file}</p>
                  <p className="text-sm text-gray-500">{formatSize(f.size)}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div className="h-full bg-green-500 rounded" style={{ width: `${f.progress}%` }} />
              </div>
              <p className="text-xs text-gray-600">{f.progress}%</p>
            </div>
          ))}
        </div>

        {files.length === 0 && <p className="text-gray-400 text-center italic">Waiting for file metadata…</p>}
      </div>
    </div>
  );
};

export default FileRecieve;
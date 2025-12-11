"use client";

import { FileIcon, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useSocketStore } from "@/lib/socketStore";
import { fileTransferStore } from "@/lib/fileTransferStore";

interface ReceivedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  receivedBytes: number;
}

interface FileRecieveProps {
  onClose: () => void;
}

const FileRecieve: React.FC<FileRecieveProps> = ({ onClose }) => {
  const socket = useSocketStore((s) => s.socket);
  const { roomId } = fileTransferStore();

  const [files, setFiles] = useState<ReceivedFile[]>([]);
  const fileWriterRef = useRef<FileSystemWritableFileStream | null>(null);

  useEffect(() => {
    if (!socket) return;

    let currentFileName = "";
    let currentFileSize = 0;
    let currentFileType = "";

    // When metadata is received
    socket.on("meta-transfer", async ({ fileName, size, fileType }) => {
      try {
        currentFileName = fileName;
        currentFileSize = size;
        currentFileType = fileType;

        // Ask user where to save file
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: currentFileName,
          types: [
            {
              description: "File",
              accept: { [fileType]: ["." + fileType.split("/")[1]] },
            },
          ],
        });

        // Create a writable stream
        fileWriterRef.current = await fileHandle.createWritable();

        // Add file to UI
        setFiles([
          {
            name: currentFileName,
            size: currentFileSize,
            type: currentFileType,
            progress: 0,
            receivedBytes: 0,
          },
        ]);
      } catch (err) {
        console.error("Save file dialog was canceled", err);
        socket.emit("close-file-transfer", { roomId });
        onClose();
      }
    });

    // Chunk receiver
    socket.on("receive-file-chunk", async ({ fileName, chunk }) => {
      if (!fileWriterRef.current) return;

      const uint = new Uint8Array(chunk);

      // Write chunk directly to disk (no RAM)
      await fileWriterRef.current.write(uint);

      // Update UI
      setFiles((prev) =>
        prev.map((f) =>
          f.name === fileName
            ? {
                ...f,
                receivedBytes: f.receivedBytes + uint.length,
                progress: Math.round(
                  ((f.receivedBytes + uint.length) / f.size) * 100
                ),
              }
            : f
        )
      );

      // Send ACK every 32 chunks
      socket.emit("chunk-ack", { roomId });
    });

    // Finalize file
    socket.on("file-transfer-end", async ({ fileName }) => {
      if (fileWriterRef.current) {
        await fileWriterRef.current.close();
        fileWriterRef.current = null;
      }

      console.log("File saved:", fileName);
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
        <button
          onClick={handleClose}
          className="absolute top-[-50px] right-[-10px] text-white border border-white rounded p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Receiving Files</h2>

        <div className="space-y-4 max-h-[430px] overflow-auto">
          {files.map((f, i) => (
            <div key={i} className="border-b p-3">
              <div className="flex items-center gap-3">
                <FileIcon className="w-8 h-8 text-blue-500" />
                <div className="truncate">
                  <p className="truncate">{f.name}</p>
                  <p className="text-sm text-gray-500">{formatSize(f.size)}</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded mt-2">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${f.progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-600">{f.progress}%</p>
            </div>
          ))}

          {files.length === 0 && (
            <p className="text-gray-400 text-center italic">
              Waiting for file metadata…
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileRecieve;

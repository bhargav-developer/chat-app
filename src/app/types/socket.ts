// types/socket.ts
export interface ServerToClientEvents {
  'receive-message': (data: {
    senderId: string;
    content: string;
    timestamp: string;
  }) => void;
  'meta-transfer': (data: Array<{
    file: string;
    size: number;
  }>) => void;
   "recieve-file-chunk": (data: {}) => void;
   "update_users": (data: Object) => void;
}

export interface ClientToServerEvents {
  'send-message': (data: {
    receiverId: string;
    content: string;
  }) => void;

  "file-meta": (data: {name: string,size: number,reciverId: string}) => void;
  "file-chunk": (data: {}) => void;
  "file-end": (data: { name: string }) => void;

  'join': (userId: string) => void;
}

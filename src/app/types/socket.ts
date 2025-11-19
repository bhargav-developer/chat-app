// types/socket.ts
export interface ServerToClientEvents {
  'receive-message': (data: {
    senderId: string;
    content: string;
    timestamp: string;
  }) => void;
  'meta-transfer': (data: any) => void;
  "receive-file-chunk": (data: {}) => void;
  "update_users": (data: Object) => void;
  "receiver-file-transfer-request": (data: any) => void;
  "file-transfer-end": (data: any) => void;
  "rejected-file-transfer": (data: any) => void;
  "close-file-transfer": (data: any) => void;
  "file-transfer-start": (data: any) => void
}

export interface ClientToServerEvents {
  'send-message': (data: {
    receiverId: string;
    content: string;
  }) => void;

  "file-meta": (data: any) => void;
  "send-file-chunk": (data: {}) => void;
  "file-end": (data: {}) => void;
  "accept-file-transfer": (data: any) => void;
  "reject-file-transfer": (data: any) => void;
  "close-file-transfer": (data: any) => void;
  'join': (userId: string) => void;
    "sender-file-transfer-req": (data: any) => void
}

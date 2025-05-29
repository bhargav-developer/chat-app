// types/socket.ts
export interface ServerToClientEvents {
  'receive-message': (data: {
    senderId: string;
    content: string;
    timestamp: string;
  }) => void;
}

export interface ClientToServerEvents {
  'send-message': (data: {
    receiverId: string;
    content: string;
  }) => void;

  'join': (userId: string) => void;
}

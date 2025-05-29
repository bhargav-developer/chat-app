// lib/socketStore.ts
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/app/types/socket';

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketState {
  socket: SocketType | null;
  setSocket: (socket: SocketType) => void;
  clearSocket: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
  clearSocket: () => set({ socket: null }),
}));

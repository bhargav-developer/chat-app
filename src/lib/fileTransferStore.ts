import { create } from "zustand";


interface fileTransfer{
    roomId: string|null,
    setRoomId: (data: string | null) => void;
}


export const fileTransferStore = create<fileTransfer>((set) => ({
    roomId: null,
    setRoomId: (roomId: string | null) => set({ roomId }),
}))
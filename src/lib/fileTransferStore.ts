import { create } from "zustand";


interface fileTransfer {
    roomId: string | null,
    setRoomId: (data: string | null) => void;
    upload: boolean,
    setUpload: (data: boolean) => void;
}


export const fileTransferStore = create<fileTransfer>((set) => ({
    roomId: null,
    setRoomId: (roomId: string | null) => set({ roomId }),
    upload: false,
    setUpload: (upload: boolean) => set({ upload })
}))
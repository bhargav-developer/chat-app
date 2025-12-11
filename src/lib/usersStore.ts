import { create } from "zustand";

interface Status {
        online: boolean;
        lastSeen?: Date;
}

interface UseState {
    statusMap: Map<string, Status>;
    setStatus: (userId: string,data: any) => void;
}

export const useUsersStore = create<UseState>((set) => ({
    statusMap: new Map(),
    setStatus: (userId,data) =>
        set((state) => {
            const newMap = new Map(state.statusMap);
            newMap.set(userId, data);
            return { statusMap: newMap };
        }),
}));

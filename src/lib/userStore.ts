import { create } from "zustand";

interface User{
    id: string,
    name: string,
    email: string,
    avatar: string,
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser:(data: {}) => void;
  clearUser: () => void;
}
export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (data) => set((prev) => ({...prev,data})),
  clearUser: () => set({ user: null }),
}));

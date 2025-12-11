import { create } from "zustand";
import { socket } from "./socket";

export const useSocketStore = create(() => ({
  socket
}));

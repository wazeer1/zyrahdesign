// store/sidebarStore.ts
import { create } from "zustand";

interface SidebarState {
  active: string;
  setActive: (menu: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  active: "product", // default active menu
  setActive: (menu: string) => set({ active: menu }),
}));

import { create } from "zustand";

interface TabStore {
  tab: number;
  setTab: (data: { tab: number }) => void;
}

const useTabStore = create<TabStore>((set) => ({
  tab: 0,
  setTab: (data) => set(data),
}));

export default useTabStore;

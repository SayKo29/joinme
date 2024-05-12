import { create } from "zustand";

interface HeaderEventStore {
  tab: string;
  setTab: (data: { tab: string }) => void;
}

const useHeaderEventStore = create<HeaderEventStore>((set) => ({
  tab: "EventMap",
  setTab: (data) => set(data),
}));

export default useHeaderEventStore;

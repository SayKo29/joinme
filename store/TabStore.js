import { create } from 'zustand';

const useTabStore = create((set) => ({
    tab: 0,
    setTab: (data) => set(data),
}));

export default useTabStore;
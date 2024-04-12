import { create } from 'zustand';

const useHeaderEventStore = create((set) => ({
    tab: 'EventMap',
    setTab: (data) => set(data),
}));

export default useHeaderEventStore;
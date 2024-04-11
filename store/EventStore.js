import { create } from 'zustand';

const useEventStore = create((set) => ({
    events: [],
    setEvents: (data) => set({ events: data }),
}));

export default useEventStore;
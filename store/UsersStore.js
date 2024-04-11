import { create } from 'zustand';

const useUsersStore = create((set) => ({
    users: [],
    setEvents: (data) => set({ users: data }),
}));

export default useUsersStore;
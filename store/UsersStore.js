import { create } from 'zustand';

const useUsersStore = create((set) => ({
    users: [],
    setUsers: (data) => set({ users: data }),
    getUsers: () => useUsersStore.getState().users
}));

export default useUsersStore;
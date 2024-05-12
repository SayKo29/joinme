import { create } from "zustand";
import type { User } from "@/types/user.type";

interface UsersStore {
  users: User[];
  setUsers: (data: User[]) => void; // Update the type of 'data' to 'User[]'
  getUsers: () => void; // Update the return type to 'void'
}

const useUsersStore: () => UsersStore = create<UsersStore>((set) => ({
  users: [],
  getUsers: () => set({ users: [] }),
  setUsers: (data) => set({ users: data }),
}));

export default useUsersStore;

import { create } from "zustand";
import type { Event } from "@/types/event.type";

interface EventStore {
  events: Event[];
  setEvents: (data: Event[]) => void;
  getEvents: () => void;
}

const useEventStore: () => EventStore = create<EventStore>((set) => ({
  events: [],
  setEvents: (data) => set({ events: data }),
  getEvents: () => set({ events: [] }),
}));

export default useEventStore;

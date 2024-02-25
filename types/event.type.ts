export type Event = {
  _id: string;
  name: string;
  description: string;
  category: string;
  latitude: string;
  longitude: string;
  images: string[];
  user: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
  chatroom: string;
};

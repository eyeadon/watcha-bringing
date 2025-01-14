import { Types } from "mongoose";

// export interface DocumentType {
//   _id?: Types.ObjectId;
// }

export interface Dish {
  publicId: string;
  userName: string;
  category: string;
  name: string;
  amount: number;
  dietary?: string[];
}

export interface DishDocumentType extends Dish {
  _id?: Types.ObjectId;
}

export interface Bev {
  publicId: string;
  userName: string;
  category: string;
  name?: string;
  amount: number;
}

export interface BevDocumentType extends Bev {
  _id?: Types.ObjectId;
}

export interface Event {
  publicId: string;
  // category: string;
  name: string;
  host: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  startDateTime: Date;
  endDateTime: Date;
  // guestCount: number;
  dishes?: string[];
  bevs?: string[];
}

export interface EventDocumentType extends Event {
  _id?: Types.ObjectId;
}

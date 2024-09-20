export interface Dish {
  publicId: string;
  category: string;
  name: string;
  amount: number;
  dietary?: string[];
}

export interface Bev {
  publicId: string;
  category: string;
  name: string;
  amount: number;
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
  date: Date;
  startTime: string;
  endTime: string;
  // guestCount: number;
  dishes: Dish[];
  bevs: Bev[];
}

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

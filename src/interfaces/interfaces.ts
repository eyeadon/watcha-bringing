export interface Dish {
  category: string;
  name: string;
  amount: number;
  dietary?: string[];
}

export interface Bev {
  category: string;
  name: string;
  amount: number;
}

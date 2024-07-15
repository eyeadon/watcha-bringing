export interface Dish {
  id: number;
  category: string;
  name: string;
  amount: number;
  dietary?: string[];
}

export interface Bev {
  id: number;
  category: string;
  name: string;
  amount: number;
}

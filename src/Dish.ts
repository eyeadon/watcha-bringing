export default interface Dish {
  id: number;
  category: string;
  name: string;
  amount: number;
  dietary?: string[];
}

import { useState } from "react";
import "./App.css";
import DishForm, { DishFormData } from "./components/DishForm";
import DishFilter from "./components/DishFilter";
import DishList from "./components/DishList";
import Dish from "./Dish";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const [dishes, setDishes] = useState<Dish[] | null>(null);

  // const [dishes, setDishes] = useState<Dish[]>([
  //   {
  //     id: 0,
  //     category: "",
  //     name: "",
  //     amount: 0,
  //     dietary: [],
  //   },
  // ]);

  function visibleDishesHelper(arr: Dish[] | null, selCat: string) {
    if (arr === null) return [];

    return selCat
      ? arr.filter((element: Dish) => element.category === selCat)
      : arr;
  }

  function setDishesHelper(arr: Dish[] | null, newDish: DishFormData) {
    if (arr === null) return [{ ...newDish, id: 1 }];

    return [...arr, { ...newDish, id: arr.length + 1 }];
  }

  // if dishes is null, value will be []
  const visibleDishes = visibleDishesHelper(dishes, selectedCategory);

  // const visibleDishes = selectedCategory
  //   ? dishes.filter((element) => element.category === selectedCategory)
  //   : dishes;

  // function applyExpenseFilter(arr) {
  //   if (selectedCategory === "All categories") return expenses;
  //   return arr.filter((element) => element.category === selectedCategory);
  // }

  return (
    <div>
      <div className="container">
        <div className="mb-5">
          <DishForm
            onSubmit={(newDish) => {
              setDishes(setDishesHelper(dishes, newDish));
              console.log(dishes);
            }}
          />
        </div>
        <div className="mb-3">
          <DishFilter
            onSelectCategory={(category) => setSelectedCategory(category)}
          />
        </div>
        <DishList
          dishes={visibleDishes}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div>
    </div>
  );
}

export default App;

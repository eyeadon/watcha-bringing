import { useState } from "react";
import "./App.css";
import DishForm, { DishFormData } from "./components/DishForm";
import DishFilter from "./components/DishFilter";
import DishList from "./components/DishList";
import { Dish, Bev } from "./interfaces/interfaces";
import BevForm, { BevFormData } from "./components/BevForm";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const [dishes, setDishes] = useState<Dish[] | null>(null);

  const [bevs, setBevs] = useState<Bev[] | null>(null);

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

  function setBevsHelper(arr: Bev[] | null, newBev: BevFormData) {
    if (arr === null) return [{ ...newBev, id: 1 }];

    return [...arr, { ...newBev, id: arr.length + 1 }];
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
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <div className="row">
        <div className="col-sm mb-5">
          <h2>What Dish?</h2>
          <DishForm
            onSubmit={(newDish) => {
              setDishes(setDishesHelper(dishes, newDish));
              console.log(dishes);
            }}
          />
        </div>
        <div className="col-sm mb-5">
          <h2>What Beverage?</h2>
          <BevForm
            onSubmit={(newBev) => {
              setBevs(setBevsHelper(dishes, newBev));
              console.log(bevs);
            }}
          />
        </div>
        {/* end row */}
      </div>
      <div className="mb-3">
        <h2>Who's Bringing What?</h2>
        <h3>Dishes</h3>
        <DishFilter
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </div>
      <div className="mb-3">
        <DishList
          dishes={visibleDishes}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div>
    </div>
  );
}

export default App;

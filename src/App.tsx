import { useState } from "react";
import "./App.css";
import BevFilter from "./components/BevFilter";
import BevForm from "./components/BevForm";
import BevList from "./components/BevList";
import DishFilter from "./components/DishFilter";
import DishForm from "./components/DishForm";
import DishList from "./components/DishList";
import { Bev, Dish } from "./interfaces/interfaces";
import ExpandableSection from "./components/ExpandableSection";
import useDishes from "./hooks/useDishes";
import APIClient from "./services/apiClient";

const apiClient = new APIClient<Dish | Bev>("/dishes");

function App() {
  // const [dishes, setDishes] = useState<Dish[] | null>(null);
  const { data, isLoading, error } = useDishes();
  const dishes = data;

  // const [bevs, setBevs] = useState<Bev[] | null>(null);

  const [selectedDishCategory, setSelectedDishCategory] = useState("");
  const [selectedBevCategory, setSelectedBevCategory] = useState("");

  //                    generic type parameter
  function setItemHelper<T>(arr: Dish[] | Bev[] | null, newItem: T) {
    if (arr === null) return [{ ...newItem, id: 1 }];

    return [...arr, { ...newItem, id: arr.length + 1 }];
  }

  // function identity<Type>(arg: Type): Type {
  //   return arg;
  // }

  function visibleItemsFilterHelper(
    arr: Dish[] | Bev[] | undefined,
    selCat: string,
    allCats: string
  ) {
    if (arr === undefined) return [];
    if (selCat === allCats) return arr;

    return selCat
      ? arr.filter((element: Dish | Bev) => element.category === selCat)
      : arr;
  }

  // if dishes is null, value will be []
  const visibleDishes = visibleItemsFilterHelper(
    dishes,
    selectedDishCategory,
    "All Dish Categories"
  );

  // const visibleBevs = visibleItemsFilterHelper(
  //   bevs,
  //   selectedBevCategory,
  //   "All Beverage Categories"
  // );

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <div className="row">
        <ExpandableSection buttonLabelText="Add Dish">
          <div className="col-sm mb-5">
            <h2>What Dish?</h2>
            <DishForm
              onSubmit={(newDish) => {
                console.log(newDish);
                apiClient.post(newDish);
                // setDishes(setItemHelper(dishes, newDish));
                console.log(dishes);
              }}
            />
          </div>
        </ExpandableSection>

        <ExpandableSection buttonLabelText="Add Beverage">
          <div className="col-sm mb-5">
            <h2>What Beverage?</h2>
            <BevForm
              onSubmit={(newBev) => {
                // setBevs(setItemHelper(bevs, newBev));
                // console.log(bevs);
              }}
            />
          </div>
        </ExpandableSection>
        {/* end row */}
      </div>

      <div className="mb-3">
        <h2>Who's Bringing What?</h2>
        <h3>Dishes</h3>
        <DishFilter
          onSelectCategory={(category) => setSelectedDishCategory(category)}
        />
      </div>
      <div className="mb-3">
        {/* <DishList
          dishes={visibleDishes}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        /> */}
      </div>

      <div className="mb-3">
        <h3>Beverages</h3>
        <BevFilter
          onSelectCategory={(category) => setSelectedBevCategory(category)}
        />
      </div>
      <div className="mb-3">
        {/* <BevList
          bevs={visibleBevs}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        /> */}
      </div>
    </div>
  );
}

export default App;

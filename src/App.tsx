import { useLayoutEffect, useState } from "react";
import "./App.css";
import BevFilter from "./components/BevFilter";
import BevForm from "./components/BevForm";
import BevList from "./components/BevList";
import DishFilter from "./components/DishFilter";
import DishForm from "./components/DishForm";
import DishList from "./components/DishList";
import { Bev, Dish } from "./interfaces/interfaces";
import ExpandableSectionButton from "./components/ExpandableSectionButton";
import APIClient from "./services/apiClient";
import { nanoid } from "nanoid";
import useDishes from "./hooks/useDishes";
import useBevs from "./hooks/useBevs";

const apiClientDish = new APIClient<Dish>("/dishes");
const apiClientBev = new APIClient<Bev>("/bevs");

function App() {
  const [selectedDishCategory, setSelectedDishCategory] = useState("");
  const [selectedBevCategory, setSelectedBevCategory] = useState("");

  const [dishes, setDishes] = useState<Dish[] | undefined>([]);
  const [bevs, setBevs] = useState<Bev[] | undefined>([]);

  const responseDishes = useDishes();
  const responseBevs = useBevs();

  // initial load of data for lists being displayed
  useLayoutEffect(() => {
    if (responseDishes.data) setDishes(responseDishes.data);
    if (responseBevs.data) setBevs(responseBevs.data);
  }, [responseDishes.data, responseBevs.data]);

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

  // if data is undefined, value will be []
  // DishList is consumer
  const visibleDishes = visibleItemsFilterHelper(
    dishes,
    selectedDishCategory,
    "All Dish Categories"
  );

  // if data is undefined, value will be []
  const visibleBevs = visibleItemsFilterHelper(
    bevs,
    selectedBevCategory,
    "All Beverage Categories"
  );

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <div className="row">
        <ExpandableSectionButton buttonLabelText="Add Dish">
          <div className="col-sm mb-5">
            <h2>What Dish?</h2>
            <DishForm
              onSubmit={(newDish) => {
                const publicId = nanoid();

                let result = apiClientDish.post({
                  ...newDish,
                  publicId: publicId,
                });

                setDishes([
                  ...(dishes || []),
                  { ...newDish, publicId: publicId },
                ]);

                console.log(result);
              }}
            />
          </div>
        </ExpandableSectionButton>

        <ExpandableSectionButton buttonLabelText="Add Beverage">
          <div className="col-sm mb-5">
            <h2>What Beverage?</h2>
            <BevForm
              onSubmit={(newBev) => {
                const publicId = nanoid();

                let result = apiClientBev.post({
                  ...newBev,
                  publicId: publicId,
                });

                setBevs([...(bevs || []), { ...newBev, publicId: publicId }]);

                console.log(result);
              }}
            />
          </div>
        </ExpandableSectionButton>
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
        <DishList
          dishes={visibleDishes}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div>

      <div className="mb-3">
        <h3>Beverages</h3>
        <BevFilter
          onSelectCategory={(category) => setSelectedBevCategory(category)}
        />
      </div>
      <div className="mb-3">
        <BevList
          bevs={visibleBevs}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div>
    </div>
  );
}

export default App;

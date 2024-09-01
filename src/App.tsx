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
import APIClient from "./services/apiClient";
import { nanoid } from "nanoid";

const apiClientDish = new APIClient<Dish>("/dishes");
const apiClientBev = new APIClient<Bev>("/bevs");

function App() {
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

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <div className="row">
        <ExpandableSection buttonLabelText="Add Dish">
          <div className="col-sm mb-5">
            <h2>What Dish?</h2>
            <DishForm
              onSubmit={(newDish) => {
                let result = apiClientDish.post({
                  ...newDish,
                  publicId: nanoid(),
                });
                console.log(result);
              }}
            />
          </div>
        </ExpandableSection>

        <ExpandableSection buttonLabelText="Add Beverage">
          <div className="col-sm mb-5">
            <h2>What Beverage?</h2>
            <BevForm
              onSubmit={(newBev) => {
                apiClientBev.post({ ...newBev, publicId: nanoid() });
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
          onSelectCategory={(category) =>
            setSelectedDishCategory(category.toLowerCase())
          }
        />
      </div>
      <div className="mb-3">
        <DishList
          selectedDishCategory={selectedDishCategory}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div>

      <div className="mb-3">
        <h3>Beverages</h3>
        <BevFilter
          onSelectCategory={(category) =>
            setSelectedBevCategory(category.toLowerCase())
          }
        />
      </div>
      <div className="mb-3">
        {/* <BevList
          selectedBevCategory={selectedBevCategory}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        /> */}
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import "./App.css";
import DishForm from "./components/DishForm";
import dishCategories from "./dishCategories";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const [dish, setDish] = useState([
    { id: 1, category: "Appetizer", name: "chicken fingers", amount: 10 },
  ]);

  const visibleExpenses = selectedCategory
    ? dish.filter((element) => element.category === selectedCategory)
    : dish;

  // function applyExpenseFilter(arr) {
  //   if (selectedCategory === "All categories") return expenses;
  //   return arr.filter((element) => element.category === selectedCategory);
  // }

  return (
    <div>
      <div className="mb-5">
        <DishForm
          onSubmit={(expense) =>
            setDish([...dish, { ...expense, id: dish.length + 1 }])
          }
        />
      </div>
      {/* <div className="mb-3">
        <ExpenseFilter
          onSelectCategory={(category) => setSelectedCategory(category)}
        />
      </div>
      <ExpenseList
        expenses={visibleExpenses}
        onDelete={(id) => setDish(dish.filter((e) => e.id !== id))}
      /> */}
    </div>
  );
}

export default App;

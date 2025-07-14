import { dishCategories } from "../categories/dishCategories.js";
import { capitalizeFirstLetter } from "../functions/functions.js";

interface Props {
  selectedDishCategory: string;
  onSelectCategory: (category: string) => void;
}

const DishFilter = ({ selectedDishCategory, onSelectCategory }: Props) => {
  return (
    <select
      name="select"
      className="form-select"
      onChange={(event) => onSelectCategory(event.target.value)}
      value={selectedDishCategory}
    >
      <option value="">All Dish Categories</option>
      {dishCategories.map((category) => (
        <option key={category} value={category}>
          {capitalizeFirstLetter(category)}
        </option>
      ))}
    </select>
  );
};

export default DishFilter;

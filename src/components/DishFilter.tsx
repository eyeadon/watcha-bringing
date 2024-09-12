import dishCategories from "../categories/dishCategories";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  onSelectCategory: (category: string) => void;
}

const DishFilter = ({ onSelectCategory }: Props) => {
  return (
    <select
      name="select"
      className="form-select"
      onChange={(event) => onSelectCategory(event.target.value)}
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

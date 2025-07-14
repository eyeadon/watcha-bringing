import { bevCategories } from "../categories/bevCategories.js";
import { capitalizeFirstLetter } from "../functions/functions.js";

interface Props {
  selectedBevCategory: string;
  onSelectCategory: (category: string) => void;
}

const BevFilter = ({ selectedBevCategory, onSelectCategory }: Props) => {
  return (
    <select
      name="select"
      className="form-select"
      onChange={(event) => onSelectCategory(event.target.value)}
      value={selectedBevCategory}
    >
      <option value="">All Beverage Categories</option>
      {bevCategories.map((category) => (
        <option key={category} value={category}>
          {capitalizeFirstLetter(category)}
        </option>
      ))}
    </select>
  );
};

export default BevFilter;

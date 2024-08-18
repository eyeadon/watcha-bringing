import bevCategories from "../categories/bevCategories";

interface Props {
  onSelectCategory: (category: string) => void;
}

const BevFilter = ({ onSelectCategory }: Props) => {
  return (
    <select
      name="select"
      className="form-select"
      onChange={(event) => onSelectCategory(event.target.value)}
    >
      <option value="">All Beverage Categories</option>
      {bevCategories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default BevFilter;

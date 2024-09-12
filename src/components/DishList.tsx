import { Dish } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  dishes: Dish[];
  // onDelete: (id: number) => void;
}

const DishList = ({ dishes }: Props) => {
  if (dishes.length === 0) return null;

  dishes.forEach((dish) => {
    dish.category = capitalizeFirstLetter(dish.category);
    dish.name = capitalizeFirstLetter(dish.name);
    if (dish.dietary !== undefined && dish.dietary.length > 0)
      dish.dietary.forEach((diet) => (diet = capitalizeFirstLetter(diet)));
  });

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Dietary</th>
        </tr>
      </thead>
      <tbody>
        {dishes.map((dish) => (
          <tr key={dish.publicId}>
            <td>{dish.category}</td>
            <td>{dish.name}</td>
            <td>{dish.amount}</td>
            <td>
              {dish.dietary?.map((diet, index, arr) => {
                // last item has no comma after it
                return index === arr.length - 1 ? diet : `${diet}, `;
              })}
            </td>
          </tr>
        ))}
      </tbody>
      {/* <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot> */}
    </table>
  );
};

export default DishList;

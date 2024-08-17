import { Dish } from "../interfaces/interfaces";
import useDishes from "../hooks/useDishes";

interface Props {
  dishes: Dish[];
  // onDelete: (id: number) => void;
}

const DishList = ({ dishes }: Props) => {
  // const { data, isLoading, error } = useDishes();

  if (dishes.length === 0) return null;

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
          <tr key={dish.id}>
            <td>{dish.category}</td>
            <td>{dish.name}</td>
            <td>{dish.amount}</td>
            <td>
              {dish.dietary?.map((diet, index, arr) => {
                return index === arr.length - 1 ? diet : `${diet}, `;
              })}
            </td>
            {/* <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDelete(dish.id)}
              >
                Delete
              </button> 
            </td> */}
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

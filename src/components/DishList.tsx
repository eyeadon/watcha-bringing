import { Dish } from "../interfaces/interfaces";
import useDishes from "../hooks/useDishes";

interface Props {
  selectedDishCategory: string;
  // onDelete: (id: number) => void;
}

function visibleItemsFilterHelper(
  arr: Dish[] | undefined,
  selCat: string,
  allCats: string
) {
  if (arr === undefined) return [];
  if (selCat === allCats) return arr;

  return selCat
    ? arr.filter((element: Dish) => element.category === selCat)
    : arr;
}

const DishList = ({ selectedDishCategory }: Props) => {
  // if (dishes.length === 0) return null;

  const { data, isLoading, error } = useDishes();

  // if dishes is null, value will be []
  const visibleDishes = visibleItemsFilterHelper(
    data,
    selectedDishCategory,
    "All Dish Categories"
  );

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
        {visibleDishes.map((dish) => (
          // TODO add key?
          <tr key="">
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

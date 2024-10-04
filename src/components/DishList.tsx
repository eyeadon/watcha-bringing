import { Dish, Event } from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";

interface Props {
  selectedEvent: Event;
  selectedDishCategory: string;
  // onDelete: (id: number) => void;
}

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  // returns UseQueryResult containing dishes in data property
  const responseEventSelectionDishes = useEventSubDoc(selectedEvent.publicId);

  // if data is undefined, value will be []
  // DishList is consumer
  const visibleDishes: Dish[] = visibleItemsFilterHelper(
    responseEventSelectionDishes.data,
    selectedDishCategory,
    "All Dish Categories"
  );

  console.log("DishList run");
  console.log(responseEventSelectionDishes.data);

  return (
    <table className="table table-bordered" key="dishTable">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Dietary</th>
        </tr>
      </thead>
      <tbody key="dishTableBody">
        {visibleDishes.map((dish) => (
          <tr key={dish.publicId}>
            <td>{capitalizeFirstLetter(dish.category)}</td>
            <td>{capitalizeFirstLetter(dish.name)}</td>
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

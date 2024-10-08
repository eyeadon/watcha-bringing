import { Dish, Event } from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import APIClient from "../services/apiClient";
import { useEffect, useState } from "react";

interface Props {
  selectedEvent: Event;
  selectedDishCategory: string;
  // onDelete: (id: number) => void;
}

const apiClientEventDishes = new APIClient<Dish[]>("/events");

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  // const [dishes, setDishes] = useState<Dish[] | undefined>([]);

  // const [status, setStatus] = useState<"pending" | "success" | "error">(
  //   "pending"
  // );

  // get array of full dish objects from selectedEvent by using its publicId
  // returns UseQueryResult containing dishes in data property responseEventSelectionDishes.data
  // const responseEventSelectionDishes = useEventSubDoc(selectedEvent.publicId);
  const { data, isLoading, status, refetch } = useEventSubDoc(
    selectedEvent.publicId
  );

  // const getSubDoc = async () => {
  //   let data = await apiClientEventDishes.getSubDoc(selectedEvent.publicId);
  //   setDishes(data);
  // };

  // useEffect(() => {
  //   getSubDoc();
  // }, [selectedEvent]);

  console.log(data);

  const eventDishes = visibleItemsFilterHelper(
    // dishes,
    data,
    selectedDishCategory,
    "All Dish Categories"
  );

  refetch();
  console.log("DishList run");
  console.log(eventDishes);

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
        {/* {status === "success" && */}
        {eventDishes.map((dish: Dish) => (
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

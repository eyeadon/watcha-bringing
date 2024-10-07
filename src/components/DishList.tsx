import { Dish, Event } from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import APIClient from "../services/apiClient";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  selectedEvent: Event;
  selectedDishCategory: string;
  // onDelete: (id: number) => void;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  // params: {
  //   key: "",
  // },
});

// const apiClientEventDishes = new APIClient<Dish[]>("/events");

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  const [dishes, setDishes] = useState<Dish[] | undefined>([]);

  // const [status, setStatus] = useState<"pending" | "success" | "error">(
  //   "pending"
  // );

  // // get array of full dish objects from selectedEvent by using its publicId
  // // returns UseQueryResult containing dishes in data property responseEventSelectionDishes.data
  // // const responseEventSelectionDishes = useEventSubDoc(selectedEvent.publicId);
  // const { data, isLoading, status } = useEventSubDoc(selectedEvent.publicId);

  // const getEventDishes = async () => {
  //   const responseEventSelectionDishes = await apiClientEventDishes.getSubDoc(
  //     selectedEvent.publicId
  //   );

  // const visibleDishes = getEventDishes();

  //   console.log(responseEventSelectionDishes);

  // get sub doc
  const getSubDoc = async (id: number | string) => {
    let data = await axiosInstance
      .get<Dish[]>("/events" + "/subdoc/" + id)
      .then((res) => res.data)
      .then((data) =>
        visibleItemsFilterHelper(
          data,
          selectedDishCategory,
          "All Dish Categories"
        )
      );

    setDishes(data);
  };

  useEffect(() => {
    getSubDoc(selectedEvent.publicId);
  }, [selectedEvent]);

  console.log("DishList run");
  console.log(dishes);

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
        {Array.isArray(dishes) &&
          dishes.map((dish: Dish) => (
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

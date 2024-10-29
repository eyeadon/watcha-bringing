import { Dish, DishDocumentType, Event } from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import APIClient from "../services/apiClient";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  selectedEvent: Event;
  selectedDishCategory: string;
  // onDelete: (id: number) => void;
}

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full dish objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, status, refetch, error } = useEventSubDoc(
    selectedEvent.publicId,
    "dish"
  );

  if (error) return error.message;

  // console.log(data);

  const eventDishes = visibleItemsFilterHelper(
    // dishes,
    data,
    selectedDishCategory,
    "All Dish Categories",
    true
  );

  // refetch();
  // console.log("DishList run");
  // console.log(eventDishes);

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
        {eventDishes.map((dish: DishDocumentType) => (
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

import { useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useDeleteDish from "../hooks/useDeleteDish";
import useEventSubDoc from "../hooks/useEventSubDoc";
import { DishDocumentType, EventDocumentType } from "../interfaces/interfaces";
import EditDishForm from "./EditDishForm";

interface Props {
  selectedEvent: EventDocumentType;
  selectedDishCategory: string;
}

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  // const showChild = isExpanded ? children : null;

  const {
    data: deleteDishData,
    error: deleteDishError,
    isError: deleteDishIsError,
    isPending: deleteDishIsPending,
    isSuccess: deleteDishIsSuccess,
    mutate: deleteDishMutate,
    mutateAsync: deleteDishMutateAsync,
    reset: deleteDishReset,
    status: deleteDishStatus,
  } = useDeleteDish();

  const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full dish objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, status, refetch, error } = useEventSubDoc(
    selectedEvent.publicId,
    "dish"
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // console.log(data);

  const eventDishes = visibleItemsFilterHelper(
    // dishes,
    data,
    selectedDishCategory,
    "All Dish Categories"
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
          <th></th>
        </tr>
      </thead>
      <tbody key="dishTableBody">
        {/* {status === "success" && */}
        {eventDishes.map((dish: DishDocumentType) => (
          <>
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
              <td>
                <button
                  className="btn btn-outline-primary btn-sm me-2 mb-2"
                  onClick={() => {}}
                >
                  Edit
                </button>

                <button
                  className="btn btn-outline-danger btn-sm mb-2"
                  onClick={async () => {
                    if (selectedEvent._id === undefined)
                      throw new Error("selectedEvent._id is undefined");
                    if (dish._id === undefined)
                      throw new Error("dish._id is undefined");

                    const result = await deleteDishMutateAsync({
                      eventId: selectedEvent._id.toString(),
                      itemId: dish._id.toString(),
                      itemKind: "dish",
                    });
                    console.log(result);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
            <Collapse in={isExpanded}>
              <EditDishForm dish={dish} />
            </Collapse>
          </>
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

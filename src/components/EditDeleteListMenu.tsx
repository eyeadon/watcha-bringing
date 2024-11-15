import { useState } from "react";
import { DishDocumentType, EventDocumentType } from "../interfaces/interfaces";
import useDeleteDish from "../hooks/useDeleteDish";
import EditDishForm from "./EditDishForm";

interface Props {
  selectedEvent: EventDocumentType;
  dish: DishDocumentType;
}

const EditDeleteListMenu = ({ selectedEvent, dish }: Props) => {
  const [editItemDisplay, setEditItemDisplay] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  return (
    <>
      <div className="col-sm p-2 border border-primary-subtle">
        <button
          className="btn btn-outline-primary btn-sm me-2 mb-2"
          onClick={() => {
            // show EditDishForm
            setEditItemDisplay(!editItemDisplay);
          }}
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
      </div>

      {editItemDisplay && (
        <EditDishForm
          dish={dish}
          editItemDisplay={editItemDisplay}
          onSubmit={() => setEditItemDisplay(false)}
        />
      )}
    </>
  );
};

export default EditDeleteListMenu;

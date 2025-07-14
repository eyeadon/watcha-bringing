import { useState } from "react";
import {
  DishDocumentType,
  EventDocumentType,
} from "../interfaces/interfaces.js";
import useDeleteDish from "../hooks/useDeleteDish.js";
import EditDishForm from "./EditDishForm.js";

interface Props {
  selectedEvent: EventDocumentType;
  dish: DishDocumentType;
}

const EditDeleteDishMenu = ({ selectedEvent, dish }: Props) => {
  const [editItemDisplay, setEditItemDisplay] = useState(false);

  const { mutateAsync: deleteDishMutateAsync } = useDeleteDish();

  return (
    <>
      <div className="col-xs col-lg-2 p-2 border border-primary-subtle">
        <button
          className="btn btn-outline-secondary btn-sm me-3 mb-2"
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
          onCancel={() => setEditItemDisplay(false)}
        />
      )}
    </>
  );
};

export default EditDeleteDishMenu;

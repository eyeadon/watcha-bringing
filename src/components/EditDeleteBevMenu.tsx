import { useState } from "react";
import { BevDocumentType, EventDocumentType } from "../interfaces/interfaces";
import useDeleteBev from "../hooks/useDeleteBev";
import EditBevForm from "./EditBevForm";

interface Props {
  selectedEvent: EventDocumentType;
  bev: BevDocumentType;
}

const EditDeleteBevMenu = ({ selectedEvent, bev }: Props) => {
  const [editItemDisplay, setEditItemDisplay] = useState(false);

  const {
    data: deleteBevData,
    error: deleteBevError,
    isError: deleteBevIsError,
    isPending: deleteBevIsPending,
    isSuccess: deleteBevIsSuccess,
    mutate: deleteBevMutate,
    mutateAsync: deleteBevMutateAsync,
    reset: deleteBevReset,
    status: deleteBevStatus,
  } = useDeleteBev();

  return (
    <>
      <div className="col p-2 border border-primary-subtle">
        <button
          className="btn btn-outline-primary btn-sm me-2 mb-2"
          onClick={() => {
            // show EditBevForm
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
            if (bev._id === undefined) throw new Error("bev._id is undefined");

            const result = await deleteBevMutateAsync({
              eventId: selectedEvent._id.toString(),
              itemId: bev._id.toString(),
              itemKind: "bev",
            });
            console.log(result);
          }}
        >
          Delete
        </button>
      </div>

      {editItemDisplay && (
        <EditBevForm
          bev={bev}
          editItemDisplay={editItemDisplay}
          onSubmit={() => setEditItemDisplay(false)}
          onCancel={() => setEditItemDisplay(false)}
        />
      )}
    </>
  );
};

export default EditDeleteBevMenu;

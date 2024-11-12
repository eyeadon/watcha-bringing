import { useContext, useState } from "react";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import { emptyEvent } from "../constants/constants";
import { SelectedEventContext } from "../contexts/contexts";
import useDeleteEvent from "../hooks/useDeleteEvent";
import { EventDocumentType } from "../interfaces/interfaces";

interface Props {
  selectedEvent: EventDocumentType;
  onClick: () => void;
}

const EditDeleteEventMenu = ({ selectedEvent, onClick }: Props) => {
  if (selectedEvent === undefined) return null;

  const context = useContext(SelectedEventContext);

  const {
    data: deleteEventData,
    error: deleteEventError,
    isError: deleteEventIsError,
    isPending: deleteEventIsPending,
    isSuccess: deleteEventIsSuccess,
    mutate: deleteEventMutate,
    mutateAsync: deleteEventMutateAsync,
    reset: deleteEventReset,
    status: deleteEventStatus,
  } = useDeleteEvent();

  const [plusMinusColor, setPlusMinusColor] = useState("#0d6efd");
  const [isExpanded, setIsExpanded] = useState(false);

  const editEventButton = isExpanded ? (
    <DashLg key="dashlg" color={plusMinusColor} className="me-1" />
  ) : (
    [
      <PlusLg key="pluslg" color={plusMinusColor} className="me-1" />,
      "Edit Event",
    ]
  );

  return (
    <>
      <div className="d-flex mb-3">
        <div className="me-2">
          <Button
            className="btn-sm mb-3"
            variant="outline-primary"
            type="button"
            onClick={onClick}
            onMouseEnter={() => setPlusMinusColor("#ffffff")}
            onMouseLeave={() => setPlusMinusColor("#0d6efd")}
          >
            {editEventButton}
          </Button>
        </div>
        <div>
          <Button
            className="btn-sm mb-3"
            variant="outline-danger"
            type="button"
            onClick={async () => {
              if (selectedEvent._id === undefined)
                throw new Error("selectedEvent._id is undefined");

              const result = await deleteEventMutateAsync(
                selectedEvent._id.toString()
              );
              console.log(result);

              result && context.setSelectedEvent(emptyEvent);
            }}
          >
            Delete Event
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditDeleteEventMenu;

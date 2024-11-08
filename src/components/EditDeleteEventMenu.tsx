import { EventDocumentType } from "../interfaces/interfaces";
import { ReactNode, useContext, useState } from "react";
import { DashLg, PlusLg } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import useDeleteEvent from "../hooks/useDeleteEvent";
import { SelectedEventContext } from "../contexts/contexts";
import { emptyEvent } from "../constants/constants";

interface Props {
  children: ReactNode;
  selectedEvent: EventDocumentType;
}

const EditDeleteEventMenu = ({ children, selectedEvent }: Props) => {
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

  const [isExpanded, setIsExpanded] = useState(false);

  const showDiv = isExpanded ? children : null;

  const editEventButton = isExpanded ? (
    <DashLg key="dashlg" color="#0d6efd" className="hoverPlusMinus" />
  ) : (
    [
      <PlusLg key="pluslg" color="#0d6efd" className="hoverPlusMinus me-1" />,
      "Edit Event",
    ]
  );

  return (
    <>
      <div className="d-flex mb-3">
        <div className="me-2">
          <Button
            className="mb-3"
            variant="outline-primary"
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {editEventButton}
          </Button>
        </div>
        <div>
          <Button
            className="mb-3"
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
      <Collapse in={isExpanded}>
        <div>{showDiv}</div>
      </Collapse>
    </>
  );
};

export default EditDeleteEventMenu;

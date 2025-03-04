import { useContext } from "react";
import Button from "react-bootstrap/Button";
import { emptyEvent } from "../constants/constants";
import { SelectedEventContext } from "../contexts/contexts";
import useDeleteEvent from "../hooks/useDeleteEvent";
import { EventDocumentType } from "../interfaces/interfaces";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {
  selectedEvent: EventDocumentType;
  editEventDisplay: boolean;
  onClick: () => void;
}

const EditDeleteEventMenu = ({
  selectedEvent,
  editEventDisplay,
  onClick,
}: Props) => {
  if (selectedEvent === undefined) return null;

  const context = useContext(SelectedEventContext);

  const { mutateAsync: deleteEventMutateAsync } = useDeleteEvent();

  const editEventButton = editEventDisplay ? "—" : "Edit Event";

  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <>
        <div className="d-flex mb-3">
          <div className="me-3">
            <Button
              className="btn-sm mb-3"
              variant="outline-secondary"
              type="button"
              onClick={onClick}
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
    )
  );
};

export default EditDeleteEventMenu;

import { useContext } from "react";
import { Button } from "react-bootstrap";
import { emptyEvent } from "../constants/constants.js";
import { SelectedEventContext } from "../contexts/contexts.js";
import useDeleteEvent from "../hooks/useDeleteEvent.js";
import { EventDocumentType } from "../interfaces/interfaces.js";
import { useAuth0 } from "@auth0/auth0-react";
import { isOwned } from "../functions/functions.js";
import useUserByEmail from "../hooks/useUserByEmail.js";

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

  const {
    isAuthenticated,
    isLoading: isLoadingAuth,
    user: auth0User,
  } = useAuth0();

  // dependent query, dependent on parameter
  let {
    data: user,
    error: errorUser,
    isLoading: isLoadingUser,
  } = useUserByEmail(auth0User?.email!);

  if (isLoadingUser) {
    return <p>Loading...</p>;
  }

  if (errorUser) {
    return <p>Error: {errorUser.message}</p>;
  }

  return (
    <>
      {isLoadingAuth ? (
        <div>Loading...</div>
      ) : isAuthenticated &&
        isOwned(selectedEvent.publicId, user!.eventsOwned) ? (
        <div className="d-flex mb-3">
          <div className="me-3">
            <Button
              name="edit"
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
              name="delete"
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
      ) : null}
    </>
  );
};

export default EditDeleteEventMenu;

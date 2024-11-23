import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";
import useEvents from "../hooks/useEvents";

interface Props {
  // children: ReactNode;
  onSelectEvent: (event: Event) => void;
}

const EventMenu = ({ onSelectEvent }: Props) => {
  // get all events
  const {
    data,
    error,
    isError,
    isLoading,
    isPending,
    isSuccess,
    refetch,
    status,
  } = useEvents();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="d-flex flex-row flex-wrap mb-3">
      {data?.map((ev) => (
        <div className="card me-1 mb-1" key={ev.publicId}>
          <div className="card-body p-2">
            <a
              className="eventMenuLink stretched-link"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onSelectEvent(ev);
              }}
            >
              {capitalizeFirstLetter(ev.name)}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventMenu;

import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  // children: ReactNode;
  events?: Event[];
  onSelectEvent: (event: Event) => void;
}

const EventMenu = ({ events, onSelectEvent }: Props) => {
  return (
    <div className="col-sm mb-3">
      {events?.map((ev) => (
        <p key={ev.publicId}>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onSelectEvent(ev);
            }}
          >
            {capitalizeFirstLetter(ev.name)}
          </a>
        </p>
      ))}
    </div>
  );
};

export default EventMenu;
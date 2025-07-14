import { Event } from "../interfaces/interfaces.js";
import { capitalizeFirstLetter } from "../functions/functions.js";

interface Props {
  selectedEvent: Event;
}

const SelectedEventTitle = ({ selectedEvent }: Props) => {
  return (
    <div className="mb-3">
      <h3>
        Current Event:&nbsp;
        <span id="selectedEventTitle">
          {capitalizeFirstLetter(selectedEvent.name)}
        </span>
      </h3>
    </div>
  );
};

export default SelectedEventTitle;

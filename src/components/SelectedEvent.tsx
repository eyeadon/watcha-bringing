import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  selectedEvent: Event;
}

const SelectedEvent = ({ selectedEvent }: Props) => {
  return (
    <h3>
      Current Event:&nbsp;
      <span id="selectedEventTitle">
        {capitalizeFirstLetter(selectedEvent.name)}
      </span>
    </h3>
  );
};

export default SelectedEvent;

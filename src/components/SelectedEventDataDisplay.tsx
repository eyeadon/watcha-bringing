import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  selectedEvent: Event;
}

const SelectedEventTitle = ({ selectedEvent }: Props) => {
  return (
    <div className="d-flex p-2 mb-3">
      <div className="p-2">
        <h4>Host:&nbsp;{capitalizeFirstLetter(selectedEvent.host)}</h4>
        <h4>Date:&nbsp;{capitalizeFirstLetter(selectedEvent.date)}</h4>
        <h4>
          Start Time:&nbsp;{capitalizeFirstLetter(selectedEvent.startTime)}
        </h4>
        <h4>
          End Time:&nbsp;
          {selectedEvent.endTime
            ? capitalizeFirstLetter(selectedEvent.endTime)
            : "?"}
        </h4>
      </div>
      <div className="p-2">
        <h4>Address:&nbsp;</h4>
        <p>{capitalizeFirstLetter(selectedEvent.address.street)}</p>
        <p>
          {selectedEvent.publicId !== "none" &&
            capitalizeFirstLetter(selectedEvent.address.city) +
              ", " +
              " " +
              capitalizeFirstLetter(selectedEvent.address.state) +
              " " +
              capitalizeFirstLetter(selectedEvent.address.zipcode)}
        </p>
      </div>
    </div>
  );
};

export default SelectedEventTitle;

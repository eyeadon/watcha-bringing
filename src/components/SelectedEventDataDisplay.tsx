import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

interface Props {
  selectedEvent: Event;
}

const SelectedEventTitle = ({ selectedEvent }: Props) => {
  return (
    <>
      {selectedEvent.publicId !== "none" && (
        <div className="d-flex mb-3">
          <div className="me-4">
            <p>
              <strong>Date:</strong>&nbsp;
              {dayjs(selectedEvent.startDateTime).format("LL")}
            </p>
            <p>
              <strong>Start Time:</strong>&nbsp;
              {dayjs(selectedEvent.startDateTime).format("LT")}
            </p>
            <p>
              <strong>End Time:</strong>&nbsp;
              {selectedEvent.endDateTime
                ? dayjs(selectedEvent.endDateTime).format("LT")
                : "?"}
            </p>
          </div>

          <div className="">
            <p>
              <strong>Address:</strong>
            </p>
            <p>
              {capitalizeFirstLetter(selectedEvent.address.street)}
              <br />
              {capitalizeFirstLetter(selectedEvent.address.city) +
                ", " +
                " " +
                capitalizeFirstLetter(selectedEvent.address.state) +
                " " +
                capitalizeFirstLetter(selectedEvent.address.zipcode)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedEventTitle;

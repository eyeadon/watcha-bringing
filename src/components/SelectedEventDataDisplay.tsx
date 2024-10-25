import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

interface Props {
  selectedEvent: Event;
}

const SelectedEventTitle = ({ selectedEvent }: Props) => {
  dayjs.extend(localizedFormat);

  return (
    <>
      {selectedEvent.publicId !== "none" && (
        <div className="d-flex p-2 mb-3">
          <div className="p-4">
            <h4>Host:&nbsp;{capitalizeFirstLetter(selectedEvent.host)}</h4>
            <h4>Date:&nbsp;{dayjs(selectedEvent.date).format("LL")}</h4>
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

          <div className="p-4">
            <h4>Address:&nbsp;</h4>
            <p>{capitalizeFirstLetter(selectedEvent.address.street)}</p>
            <p>
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

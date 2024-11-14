import { Fade } from "@mui/material";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { capitalizeFirstLetter } from "../functions/functions";
import { Event } from "../interfaces/interfaces";
dayjs.extend(localizedFormat);

interface Props {
  selectedEvent: Event;
  editEventDisplay: boolean;
}

const SelectedEventTitle = ({ selectedEvent, editEventDisplay }: Props) => {
  return (
    <>
      <Fade in={!editEventDisplay}>
        <div>
          <h4>Host:&nbsp;{capitalizeFirstLetter(selectedEvent.host)}</h4>

          <div className="d-flex mb-3">
            <div className="me-5">
              <p>
                <strong>Start Date:</strong>
                <br />
                {dayjs(selectedEvent.startDateTime).format("LL")}
              </p>
              <p>
                <strong>End Date:</strong>
                <br />
                {dayjs(selectedEvent.endDateTime).format("LL")}
              </p>
            </div>

            <div className="me-5">
              <p>
                <strong>Start Time:</strong>
                <br />
                {dayjs(selectedEvent.startDateTime).format("LT")}
              </p>
              <p>
                <strong>End Time:</strong>
                <br />
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
        </div>
      </Fade>
    </>
  );
};

export default SelectedEventTitle;

import { useState } from "react";
import "./App.css";
import BevFilter from "./components/BevFilter";
import BevForm from "./components/BevForm";
import BevList from "./components/BevList";
import DishFilter from "./components/DishFilter";
import DishForm from "./components/DishForm";
import DishList from "./components/DishList";
import EventForm from "./components/EventForm";
import EventMenu from "./components/EventMenu";
import ExpandableSectionButton from "./components/ExpandableSectionButton";
import ExpandableSectionButtonNewEvent from "./components/ExpandableSectionButtonNewEvent";
import SelectedEventDataDisplay from "./components/SelectedEventDataDisplay";
import SelectedEventTitle from "./components/SelectedEventTitle";
import { emptyEvent } from "./constants/constants";
import {
  EventFormIsExpandedContext,
  SelectedEventContext,
} from "./contexts/contexts";
import { EventDocumentType } from "./interfaces/interfaces";
import EditDeleteEventMenu from "./components/EditDeleteEventMenu";
import { Fade } from "@mui/material";
import EditEventForm from "./components/EditEventForm";

function App() {
  const [eventFormisExpanded, setEventFormIsExpanded] = useState(false);

  // function setIsExpanded(isExpanded: boolean) {
  //   setEventFormIsExpanded(isExpanded);
  // }

  const [selectedDishCategory, setSelectedDishCategory] = useState("");
  const [selectedBevCategory, setSelectedBevCategory] = useState("");
  // emptyEvent.publicId = "none"
  const [selectedEvent, setSelectedEvent] =
    useState<EventDocumentType>(emptyEvent);
  const [editEventDisplay, setEditEventDisplay] = useState(false);

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <h2>Events</h2>
      <SelectedEventContext.Provider
        value={{ selectedEvent, setSelectedEvent }}
      >
        <EventMenu
          onSelectEvent={(ev) => {
            setSelectedEvent(ev);
            // console.log(ev);
            // console.log(selectedEvent);
          }}
        />

        <div className="row mb-1">
          <EventFormIsExpandedContext.Provider
            value={{ eventFormisExpanded, setEventFormIsExpanded }}
          >
            <div className="col-sm-12 mb-3">
              <ExpandableSectionButtonNewEvent buttonLabelText="Add Event">
                <EventForm
                  onSubmit={(newEventResult: EventDocumentType) => {
                    setSelectedEvent(newEventResult);
                  }}
                />
              </ExpandableSectionButtonNewEvent>
            </div>
          </EventFormIsExpandedContext.Provider>
        </div>

        {selectedEvent.publicId !== "none" && (
          <>
            <SelectedEventTitle selectedEvent={selectedEvent} />
            {selectedEvent.publicId !== "none" && (
              <>
                {editEventDisplay === false && (
                  <SelectedEventDataDisplay
                    selectedEvent={selectedEvent}
                    editEventDisplay={editEventDisplay}
                  />
                )}
                {editEventDisplay && (
                  <EditEventForm
                    selectedEvent={selectedEvent}
                    editEventDisplay={editEventDisplay}
                    onSubmit={(newEventResult: EventDocumentType) => {
                      setSelectedEvent(newEventResult);
                      setEditEventDisplay(!editEventDisplay);
                    }}
                  />
                )}
                <EditDeleteEventMenu
                  selectedEvent={selectedEvent}
                  editEventDisplay={editEventDisplay}
                  onClick={() => setEditEventDisplay(!editEventDisplay)}
                />
              </>
            )}

            <div className="row mb-1">
              <div className="col-sm mb-3">
                <ExpandableSectionButton buttonLabelText="Add Dish">
                  <h2>What Dish?</h2>
                  <DishForm selectedEvent={selectedEvent} />
                </ExpandableSectionButton>
              </div>

              <div className="col-sm mb-3">
                <ExpandableSectionButton buttonLabelText="Add Beverage">
                  <h2>What Beverage?</h2>
                  <BevForm selectedEvent={selectedEvent} />
                </ExpandableSectionButton>
              </div>
              {/* end row */}
            </div>

            <div className="row w-100 mb-1">
              <div className="mb-3">
                <h2>Who's Bringing What?</h2>
                <h3>Dishes</h3>
                <DishFilter
                  onSelectCategory={(category) => {
                    setSelectedDishCategory(category);
                  }}
                />
              </div>
              <div className="mb-3">
                <DishList
                  selectedEvent={selectedEvent}
                  selectedDishCategory={selectedDishCategory}
                />
              </div>

              <div className="mb-3">
                <h3>Beverages</h3>
                <BevFilter
                  onSelectCategory={(category) =>
                    setSelectedBevCategory(category)
                  }
                />
              </div>
              <div className="mb-3">
                <BevList
                  selectedEvent={selectedEvent}
                  selectedBevCategory={selectedBevCategory}
                />
              </div>
              {/* end row */}
            </div>
          </>
        )}
      </SelectedEventContext.Provider>
      {/* end container */}
    </div>
  );
}

export default App;

import { nanoid } from "nanoid";
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
import usePostBev from "./hooks/usePostBev";
import usePostDish from "./hooks/usePostDish";
import usePutEvent from "./hooks/usePutEvent";
import { EventDocumentType } from "./interfaces/interfaces";

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

  const {
    data: postBevData,
    error: postBevError,
    isError: postBevIsError,
    isPending: postBevIsPending,
    isSuccess: postBevIsSuccess,
    mutate: postBevMutate,
    mutateAsync: postBevMutateAsync,
    reset: postBevReset,
    status: postBevStatus,
  } = usePostBev();

  // put Event
  const {
    data: putEventData,
    error: putEventError,
    isError: putEventIsError,
    isPending: putEventIsPending,
    isSuccess: putEventIsSuccess,
    mutate: putEventMutate,
    mutateAsync: putEventMutateAsync,
    reset: putEventReset,
    status: putEventStatus,
  } = usePutEvent(selectedEvent);

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
            <SelectedEventDataDisplay selectedEvent={selectedEvent} />

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
                  <BevForm
                    onSubmit={async (newBev) => {
                      const publicId = nanoid();
                      const newBevWithPublicId = {
                        ...newBev,
                        publicId: publicId,
                      };

                      const resultBevFromMutate = await postBevMutateAsync(
                        newBevWithPublicId
                      );

                      console.log(resultBevFromMutate);

                      // adding Bev to event ********************************

                      if (resultBevFromMutate === undefined)
                        throw new Error("resultBev is undefined");

                      const resultBevId = resultBevFromMutate._id?.toString();

                      if (resultBevId === undefined)
                        throw new Error("resultBevId is undefined");
                      if (selectedEvent.bevs === undefined)
                        throw new Error("selectedEvent.bevs is undefined");

                      // add newBev id to selectedEvent
                      selectedEvent.publicId !== "none"
                        ? selectedEvent.bevs.push(resultBevId)
                        : new Error("no event selected");

                      const selectedEventWithoutId = { ...selectedEvent };
                      delete selectedEventWithoutId._id;

                      const resultEventFromMutate = await putEventMutateAsync(
                        selectedEventWithoutId
                      );

                      console.log(resultEventFromMutate);
                    }}
                  />
                </ExpandableSectionButton>
              </div>
              {/* end row */}
            </div>

            <div className="row mb-1">
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

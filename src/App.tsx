import { nanoid } from "nanoid";
import { useState } from "react";
import "./App.css";
import BevFilter from "./components/BevFilter";
import BevForm from "./components/BevForm";
import BevList from "./components/BevList";
import DishFilter from "./components/DishFilter";
import DishForm from "./components/DishForm";
import DishList from "./components/DishList";
import EventMenu from "./components/EventMenu";
import ExpandableSectionButton from "./components/ExpandableSectionButton";
import useEvents from "./hooks/useEvents";
import {
  Bev,
  Dish,
  Event,
  DishDocumentType,
  BevDocumentType,
  EventDocumentType,
  FormEvent,
} from "./interfaces/interfaces";
import APIClient from "./services/apiClient";
import EventForm from "./components/EventForm";
import SelectedEventTitle from "./components/SelectedEventTitle";
import { emptyEvent } from "./constants/constants";
import usePostDish from "./hooks/usePostDish";
import usePostBev from "./hooks/usePostBev";
import usePostEvent from "./hooks/usePostEvent";
import usePutEvent from "./hooks/usePutEvent";
import dayjs from "dayjs";
import {
  dayJsObjectToHourAndMinute,
  setDateDayJs,
} from "./functions/functions";
import ExpandableSectionButtonNewEvent from "./components/ExpandableSectionButtonNewEvent";
import {
  EventFormIsExpandedContext,
  SelectedEventContext,
} from "./contexts/contexts";
import SelectedEventDataDisplay from "./components/SelectedEventDataDisplay";

function App() {
  // const apiClientDish = new APIClient<Dish>("/dishes");
  // const apiClientBev = new APIClient<Bev>("/bevs");
  // const apiClientEvent = new APIClient<Event>("/events");
  // const apiClientTDish = new APIClient<DishDocumentType>("/dishes");
  // const apiClientTBev = new APIClient<BevDocumentType>("/bevs");
  // const apiClientTEvent = new APIClient<EventDocumentType>("/events");
  // const apiClientEventDishes = new APIClient<Dish[]>("/events");

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
    data: postDishData,
    error: postDishError,
    isError: postDishIsError,
    isPending: postDishIsPending,
    isSuccess: postDishIsSuccess,
    mutate: postDishMutate,
    mutateAsync: postDishMutateAsync,
    reset: postDishReset,
    status: postDishStatus,
  } = usePostDish();

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

  // post Event
  const {
    data: postEventData,
    error: postEventError,
    isError: postEventIsError,
    isPending: postEventIsPending,
    isSuccess: postEventIsSuccess,
    mutate: postEventMutate,
    mutateAsync: postEventMutateAsync,
    reset: postEventReset,
    status: postEventStatus,
  } = usePostEvent();

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

  // get all events
  const {
    data: responseEventsData,
    error: responseEventsError,
    isError: responseEventsIsError,
    isLoading: responseEventsIsLoading,
    isPending: responseEventsIsPending,
    isSuccess: responseEventsIsSuccess,
    refetch: responseEventsRefetch,
    status: responseEventsStatus,
  } = useEvents();

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <h2>Events</h2>
      <SelectedEventContext.Provider
        value={{ selectedEvent, setSelectedEvent }}
      >
        <EventMenu
          events={responseEventsData}
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
            <div className="col-sm-6 mb-3">
              <ExpandableSectionButtonNewEvent buttonLabelText="Add Event">
                <EventForm
                  onSubmit={async (newEvent: FormEvent) => {
                    const publicId = nanoid();

                    if (newEvent.date === undefined)
                      throw new Error("date is undefined");

                    const newEventWithPublicId = {
                      ...newEvent,
                      publicId: publicId,
                      startDateTime: setDateDayJs(
                        newEvent.date,
                        newEvent.startDateTime
                      ).toDate(),
                      endDateTime: setDateDayJs(
                        newEvent.date,
                        newEvent.endDateTime
                      ).toDate(),
                    };

                    delete newEventWithPublicId.date;

                    console.log(newEventWithPublicId);

                    const resultEventFromMutate = await postEventMutateAsync(
                      newEventWithPublicId
                    );

                    console.log(resultEventFromMutate);

                    responseEventsRefetch();
                    setSelectedEvent(resultEventFromMutate);
                  }}
                />
              </ExpandableSectionButtonNewEvent>
            </div>
          </EventFormIsExpandedContext.Provider>
        </div>

        <SelectedEventTitle selectedEvent={selectedEvent} />
        <SelectedEventDataDisplay selectedEvent={selectedEvent} />

        <div className="row mb-1">
          <div className="col-sm mb-3">
            <ExpandableSectionButton buttonLabelText="Add Dish">
              <h2>What Dish?</h2>
              <DishForm
                onSubmit={async (newDish) => {
                  const publicId = nanoid();
                  const newDishWithPublicId = {
                    ...newDish,
                    publicId: publicId,
                  };

                  const resultDishFromMutate = await postDishMutateAsync(
                    newDishWithPublicId
                  );

                  console.log(resultDishFromMutate);

                  // adding dish to event ********************************

                  if (resultDishFromMutate === undefined)
                    throw new Error("resultDish is undefined");

                  const resultDishId = resultDishFromMutate._id?.toString();

                  if (resultDishId === undefined)
                    throw new Error("resultDishId is undefined");
                  if (selectedEvent.dishes === undefined)
                    throw new Error("selectedEvent.dishes is undefined");

                  // add newDish id to selectedEvent
                  selectedEvent.publicId !== "none"
                    ? selectedEvent.dishes.push(resultDishId)
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
              onSelectCategory={(category) => setSelectedBevCategory(category)}
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
      </SelectedEventContext.Provider>
      {/* end container */}
    </div>
  );
}

export default App;

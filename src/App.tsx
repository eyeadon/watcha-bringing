import { nanoid } from "nanoid";
import { useEffect, useLayoutEffect, useState } from "react";
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
} from "./interfaces/interfaces";
import APIClient from "./services/apiClient";
import EventForm from "./components/EventForm";
import SelectedEventTitle from "./components/SelectedEventTitle";
import { emptyEvent } from "./constants";
import usePostDish from "./hooks/usePostDish";
import usePostEvent from "./hooks/usePostEvent";
import usePutEvent from "./hooks/usePutEvent";

function App() {
  const apiClientDish = new APIClient<Dish>("/dishes");
  const apiClientBev = new APIClient<Bev>("/bevs");
  const apiClientEvent = new APIClient<Event>("/events");
  const apiClientTDish = new APIClient<DishDocumentType>("/dishes");
  const apiClientTEvent = new APIClient<EventDocumentType>("/events");
  const apiClientEventDishes = new APIClient<Dish[]>("/events");

  // const [dishes, setDishes] = useState<Dish[] | undefined>([]);
  // const [bevs, setBevs] = useState<Bev[] | undefined>([]);
  // events for event menu
  // const [events, setEvents] = useState<EventDocumentType[] | undefined>([]);

  const [selectedDishCategory, setSelectedDishCategory] = useState("");
  const [selectedBevCategory, setSelectedBevCategory] = useState("");
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

  // // initial load of data for lists being displayed
  // useLayoutEffect(() => {
  //   setEvents(responseEvents.data);
  //   console.log(responseEvents);
  // }, [responseEvents.data]);

  // // returns UseQueryResult containing dishes
  // const responseEventSelectionDishes = useEventSubDoc(selectedEvent.publicId);

  // const getEventDishes = async () => {
  //   let data = await apiClientEventDishes.getSubDoc(selectedEvent.publicId);
  //   setDishes(data);
  // };

  // useEffect(() => {
  //   getEventDishes();
  // }, [selectedEvent]);

  // // if data is undefined, value will be []
  // const visibleBevs = visibleItemsFilterHelper(
  //   bevs,
  //   selectedBevCategory,
  //   "All Beverage Categories"
  // );

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <h2>Events</h2>
      <EventMenu
        events={responseEventsData}
        onSelectEvent={(ev) => {
          setSelectedEvent(ev);
          // console.log(ev);
          // console.log(selectedEvent);
        }}
      />
      <SelectedEventTitle selectedEvent={selectedEvent} />

      <div className="row">
        <ExpandableSectionButton buttonLabelText="Add Event">
          <div className="mb-5">
            <EventForm
              onSubmit={async (newEvent) => {
                const publicId = nanoid();
                const newEventWithPublicId = {
                  ...newEvent,
                  publicId: publicId,
                };

                const resultEventFromMutate = await postEventMutateAsync(
                  newEventWithPublicId
                );

                console.log(resultEventFromMutate);

                setSelectedEvent(resultEventFromMutate);

                // // add new event to events state variable
                // setEvents([...(events || []), { ...newEventWithPublicId }]);

                postEventIsSuccess ? console.log(postEventData) : null;
              }}
            />
          </div>
        </ExpandableSectionButton>
      </div>

      <div className="row">
        <ExpandableSectionButton buttonLabelText="Add Dish">
          <div className="mb-5">
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

                // get newly created _id for newDish
                const resultDish = await apiClientTDish.getSingleByPublicId(
                  newDishWithPublicId.publicId
                );
                console.log(resultDish);

                if (resultDish === undefined)
                  throw new Error("resultDish is undefined");

                const resultDishId = resultDish._id?.toString();

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

                // setSelectedEvent(resultEvent);

                // // update event in events state variable
                // const latestEvents = [...(events || [])];
                // latestEvents?.forEach((element) => {
                //   if (element.publicId === putEventData.publicId)
                //     element = putEventData;
                // });

                // setEvents(latestEvents);
              }}
            />
          </div>
        </ExpandableSectionButton>

        <ExpandableSectionButton buttonLabelText="Add Beverage">
          <div className="mb-5">
            <h2>What Beverage?</h2>
            <BevForm
              onSubmit={(newBev) => {
                const publicId = nanoid();

                let result = apiClientBev.post({
                  ...newBev,
                  publicId: publicId,
                });

                // setBevs([...(bevs || []), { ...newBev, publicId: publicId }]);

                // console.log(result);
              }}
            />
          </div>
        </ExpandableSectionButton>
        {/* end row */}
      </div>

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
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div>

      <div className="mb-3">
        <h3>Beverages</h3>
        <BevFilter
          onSelectCategory={(category) => setSelectedBevCategory(category)}
        />
      </div>
      <div className="mb-3">
        {/* <BevList
          bevs={visibleBevs}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        /> */}
      </div>

      {/* end container */}
    </div>
  );
}

export default App;

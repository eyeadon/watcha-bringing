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
import useEventSubDoc from "./hooks/useEventSubDoc";
import EventForm from "./components/EventForm";
import mongoose from "mongoose";
import SelectedEvent from "./components/SelectedEvent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDishes from "./hooks/useDishes";

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
  const [selectedEvent, setSelectedEvent] = useState<EventDocumentType>({
    publicId: "none",
    name: "",
    host: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    date: "",
    startTime: "",
    endTime: "",
    dishes: [],
    bevs: [],
  });

  const queryClient = useQueryClient();

  // post Dish
  const {
    data: postDishData,
    error: postDishError,
    isError: postDishIsError,
    isPending: postDishIsPending,
    isSuccess: postDishIsSuccess,
    mutate: postDishMutate,
    reset: postDishReset,
    status: postDishStatus,
  } = useMutation({
    mutationFn: (newDish: Dish) => {
      return apiClientDish.post(newDish);
    },
  });

  // post Event
  const {
    data: postEventData,
    error: postEventError,
    isError: postEventIsError,
    isPending: postEventIsPending,
    isSuccess: postEventIsSuccess,
    mutate: postEventMutate,
    reset: postEventReset,
    status: postEventStatus,
  } = useMutation({
    mutationFn: (newEvent: Event) => {
      return apiClientEvent.post(newEvent);
    },
    // called before mutation is executed
    //        (input -> data to be sent to back end)
    onMutate: (newEvent: Event) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Event[]>(["events"], (events) => [
        newEvent,
        ...(events || []),
      ]);
    },
  });

  // put Event
  const {
    data: putEventData,
    error: putEventError,
    isError: putEventIsError,
    isPending: putEventIsPending,
    isSuccess: putEventIsSuccess,
    mutate: putEventMutate,
    reset: putEventReset,
    status: putEventStatus,
  } = useMutation({
    mutationFn: (event: Event) => {
      if (selectedEvent._id === undefined)
        throw new Error("selectedEvent._id is undefined");

      return apiClientEvent.put(selectedEvent._id.toString(), event);
    },
    // called before mutation is executed
    //        (input -> data to be sent to back end)
    onMutate: (newEvent: Event) => {
      //                              (queryKey, updater, options?)
      queryClient.setQueryData<Event[]>(["events"], (events) => [
        newEvent,
        ...(events || []),
      ]);
    },
  });

  const {
    data: responseDishesData,
    error: responseDishesError,
    isError: responseDishesIsError,
    isLoading: responseDishesIsLoading,
    isPending: responseDishesIsPending,
    isSuccess: responseDishesIsSuccess,
    refetch: responseDishesRefetch,
    status: responseDishesStatus,
  } = useDishes();

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
      <SelectedEvent selectedEvent={selectedEvent} />

      <div className="row">
        <ExpandableSectionButton buttonLabelText="Add Event">
          <div className="mb-5">
            <EventForm
              onSubmit={(newEvent) => {
                const publicId = nanoid();
                const newEventWithPublicId = {
                  ...newEvent,
                  publicId: publicId,
                };

                postEventMutate(newEventWithPublicId);

                // setSelectedEvent(data);

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

                postDishMutate(newDishWithPublicId);

                console.log(postDishData);

                if (responseDishesData === undefined)
                  throw new Error("responseDishesData is undefined");

                const resultDish = responseDishesData.find(
                  (element: Dish) =>
                    element.publicId === newDishWithPublicId.publicId
                );

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

                putEventMutate(selectedEventWithoutId);

                console.log(putEventData);

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

        {/* <ExpandableSectionButton buttonLabelText="Add Beverage">
          <div className="mb-5">
            <h2>What Beverage?</h2>
            <BevForm
              onSubmit={(newBev) => {
                const publicId = nanoid();

                let result = apiClientBev.post({
                  ...newBev,
                  publicId: publicId,
                });

                setBevs([...(bevs || []), { ...newBev, publicId: publicId }]);

                // console.log(result);
              }}
            />
          </div>
        </ExpandableSectionButton>
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
        <BevList
          bevs={visibleBevs}
          // onDelete={(id) => setDish(dishes.filter((e) => e.id !== id))}
        />
      </div> 
 */}
        {/* end row */}
      </div>
      {/* end container */}
    </div>
  );
}

export default App;

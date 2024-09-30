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

const apiClientDish = new APIClient<Dish>("/dishes");
const apiClientBev = new APIClient<Bev>("/bevs");
const apiClientEvent = new APIClient<Event>("/events");
const apiClientTDish = new APIClient<DishDocumentType>("/dishes");
const apiClientTEvent = new APIClient<EventDocumentType>("/events");
// const apiClientEventDishes = new APIClient<Dish[]>("/events");

function App() {
  // const [dishes, setDishes] = useState<Dish[] | undefined>([]);
  const [bevs, setBevs] = useState<Bev[] | undefined>([]);
  // events for event menu
  const [events, setEvents] = useState<EventDocumentType[] | undefined>([]);

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

  // returns UseQueryResult
  const responseEvents = useEvents();

  // initial load of data for lists being displayed
  useLayoutEffect(() => {
    setEvents(responseEvents.data);
  }, [responseEvents.data]);
  console.log(responseEvents);

  // returns UseQueryResult containing dishes
  const responseEventSelectionDishes = useEventSubDoc(
    // "4jdh6jf8ejfu6768gjeu4"
    // "4jdh6jf8ejfu6768gjeu5"
    selectedEvent.publicId
  );

  // dishes array
  // console.log(responseEventSelectionDishes.data);

  function visibleItemsFilterHelper(
    arr: Dish[] | Bev[] | undefined,
    selCat: string,
    allCats: string
  ) {
    if (arr === undefined) return [];
    if (selCat === allCats) return arr;

    return selCat
      ? arr.filter((element: Dish | Bev) => element.category === selCat)
      : arr;
  }

  // if data is undefined, value will be []
  // DishList is consumer
  const visibleDishes = visibleItemsFilterHelper(
    responseEventSelectionDishes.data,
    selectedDishCategory,
    "All Dish Categories"
  );

  // if data is undefined, value will be []
  const visibleBevs = visibleItemsFilterHelper(
    bevs,
    selectedBevCategory,
    "All Beverage Categories"
  );

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <h2>Events</h2>
      <EventMenu
        events={events}
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

                let postEvent = async () => {
                  let resultEvent = await apiClientEvent.post({
                    ...newEvent,
                    publicId: publicId,
                  });

                  // setBevs([...(bevs || []), { ...newBev, publicId: publicId }]);
                  setSelectedEvent({
                    ...newEvent,
                    publicId: publicId,
                  });

                  console.log(resultEvent);
                };

                postEvent();
              }}
            />
          </div>
        </ExpandableSectionButton>
      </div>
      {/* <ExpandableSectionMenu selectedEvent={selectedEvent}> */}

      <div className="row">
        <ExpandableSectionButton buttonLabelText="Add Dish">
          <div className="mb-5">
            <h2>What Dish?</h2>
            <DishForm
              onSubmit={async (newDish) => {
                const publicId = nanoid();

                let postDish = async () => {
                  let resultDish = await apiClientTDish.post({
                    ...newDish,
                    publicId: publicId,
                  });

                  console.log(resultDish);

                  const resultDishId = resultDish._id?.toString();

                  if (resultDishId === undefined) throw Error;
                  if (selectedEvent.dishes === undefined) throw Error;

                  // add new dish to selected event
                  selectedEvent.dishes.push(resultDishId);
                };

                await postDish();

                let putEvent = async () => {
                  if (selectedEvent._id === undefined) throw Error;

                  const selectedEventId = selectedEvent._id.toString();

                  const selectedEventWithoutId = { ...selectedEvent };
                  delete selectedEventWithoutId._id;

                  // put = (id: number | string, data: T)
                  let resultEvent = await apiClientEvent.put(
                    // responseEventSelectionDishes.data._id,
                    selectedEventId,
                    selectedEventWithoutId
                  );

                  console.log(resultEvent);
                };

                await putEvent();
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

                setBevs([...(bevs || []), { ...newBev, publicId: publicId }]);

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
          onSelectCategory={(category) => setSelectedDishCategory(category)}
        />
      </div>
      <div className="mb-3">
        <DishList
          dishes={visibleDishes}
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

      {/* </ExpandableSectionMenu> */}

      {/* end container */}
    </div>
  );
}

export default App;

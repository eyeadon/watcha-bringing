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
import { Bev, Dish, Event } from "./interfaces/interfaces";
import APIClient from "./services/apiClient";

const apiClientDish = new APIClient<Dish>("/dishes");
const apiClientBev = new APIClient<Bev>("/bevs");
const apiClientEventDishes = new APIClient<Dish[]>("/events");

function App() {
  const [selectedDishCategory, setSelectedDishCategory] = useState("");
  const [selectedBevCategory, setSelectedBevCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event>({
    publicId: "4jdh6jf8ejfu6768gjeu4",
    name: "",
    host: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    date: new Date(),
    startTime: "",
    endTime: "",
    dishes: [],
    bevs: [],
  });

  const [dishes, setDishes] = useState<Dish[] | undefined>([]);
  const [bevs, setBevs] = useState<Bev[] | undefined>([]);
  const [events, setEvents] = useState<Event[] | undefined>([]);

  // returns UseQueryResult
  const responseEvents = useEvents();

  // initial load of data for lists being displayed
  useLayoutEffect(() => {
    setEvents(responseEvents.data);
  }, [responseEvents.data]);

  const getEventDishes = async () => {
    let data = await apiClientEventDishes.getSubDoc(selectedEvent.publicId);
    setDishes(data);
  };

  useEffect(() => {
    getEventDishes();
  }, [selectedEvent]);

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
    dishes,
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
          console.log(ev);
          console.log(selectedEvent);
          console.log(dishes);
        }}
      />
      {/* <ExpandableSectionMenu selectedEvent={selectedEvent}> */}

      <div className="row">
        <ExpandableSectionButton buttonLabelText="Add Dish">
          <div className="mb-5">
            <h2>What Dish?</h2>
            <DishForm
              onSubmit={(newDish) => {
                const publicId = nanoid();

                let result = apiClientDish.post({
                  ...newDish,
                  publicId: publicId,
                });

                setDishes([
                  ...(dishes || []),
                  { ...newDish, publicId: publicId },
                ]);

                console.log(result);
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

                console.log(result);
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

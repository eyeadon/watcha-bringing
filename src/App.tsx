import { useLayoutEffect, useState } from "react";
import "./App.css";
import BevFilter from "./components/BevFilter";
import BevForm from "./components/BevForm";
import BevList from "./components/BevList";
import DishFilter from "./components/DishFilter";
import DishForm from "./components/DishForm";
import DishList from "./components/DishList";
import { Bev, Dish, Event } from "./interfaces/interfaces";
import ExpandableSectionButton from "./components/ExpandableSectionButton";
import APIClient from "./services/apiClient";
import { nanoid } from "nanoid";
import useDishes from "./hooks/useDishes";
import useBevs from "./hooks/useBevs";
import ExpandableSectionMenu from "./components/ExpandableSectionMenu";
import useEvents from "./hooks/useEvents";
import { capitalizeFirstLetter } from "./functions/functions";
import useDish from "./hooks/useDish";
import useEvent from "./hooks/useEvent";

// post, put
const apiClientDish = new APIClient<Dish>("/dishes");
const apiClientBev = new APIClient<Bev>("/bevs");

function App() {
  const [selectedDishCategory, setSelectedDishCategory] = useState("");
  const [selectedBevCategory, setSelectedBevCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

  const [dishes, setDishes] = useState<Dish[] | undefined>([]);
  const [bevs, setBevs] = useState<Bev[] | undefined>([]);
  const [events, setEvents] = useState<Event[] | undefined>([]);

  // const responseDishes = useDishes();
  // const responseBevs = useBevs();
  const responseEvents = useEvents();
  const responseEvent = useEvent(
    // "66ecbcb1c747870f6d1224b7"
    "4jdh6jf8ejfu6768gjeu4"
    // selectedEvent?.publicId ? selectedEvent.publicId : ""
  );

  // let responseDishes = buildItems(selectedEvent?.dishes);

  // initial load of data for lists being displayed
  useLayoutEffect(() => {
    // if (responseDishes.data) setDishes(responseDishes.data);
    // if (responseBevs.data) setBevs(responseBevs.data);
    if (responseEvents.data) setEvents(responseEvents.data);
    if (responseEvent.data) setDishes(responseEvent.data.dishes);
  }, [responseEvents.data, responseEvent.data]);

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

  // // return Promise
  // function buildItems(arr: Dish[] | Bev[] | undefined) {
  //   if (arr === undefined) return [];
  //   // useDish returns {data}
  //   let resArray: Array<Dish> = [];
  //   arr.map((item) => {
  //     let res = useDish(item.toString());
  //     if (res.data === undefined) return;
  //     resArray.push(res.data);
  //   });
  //   return resArray;
  // }

  return (
    <div className="container">
      <h1>Watcha Bringing?</h1>
      <h2>Events</h2>
      <div className="col-sm mb-3">
        {events?.map((ev) => (
          <p key={ev.publicId}>
            <a
              href="#"
              onClick={() => {
                setSelectedEvent(ev);
                // setDishes(dishes);
                console.log(selectedEvent);
                console.log(dishes);
              }}
            >
              {capitalizeFirstLetter(ev.name)}
            </a>
          </p>
        ))}
      </div>

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

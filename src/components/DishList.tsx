import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import { DishDocumentType, EventDocumentType } from "../interfaces/interfaces";
import EditDeleteDishMenu from "./EditDeleteDishMenu";

interface Props {
  selectedEvent: EventDocumentType;
  selectedDishCategory: string;
}

const DishList = ({ selectedEvent, selectedDishCategory }: Props) => {
  if (selectedEvent.dishes === undefined) return null;

  // const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full dish objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, error } = useEventSubDoc(
    selectedEvent.publicId,
    "dish"
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // console.log(data);

  const eventDishes = visibleItemsFilterHelper(
    // dishes,
    data,
    selectedDishCategory,
    "All Dish Categories"
  );

  // refetch();

  return (
    <div className="container border border-2 border-primary-subtle">
      {/* lg screens and larger */}
      {eventDishes.length !== 0 ? (
        <div className="row bg-primary-subtle d-none d-lg-flex" key="header">
          <div className="col-lg-3 p-2 border border-primary-subtle">
            <strong>Chef</strong>
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle">
            <strong>Category</strong>
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle">
            <strong>Dish Name</strong>
          </div>
          <div className="col-lg-1 p-2 border border-primary-subtle">
            <strong>Amount</strong>
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle">
            <strong>Dietary</strong>
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle"></div>
        </div>
      ) : (
        <div>No dishes</div>
      )}

      {/* lg screens and larger */}
      {eventDishes.map((dish: DishDocumentType) => (
        <div className="row d-none d-lg-flex" key={dish.publicId}>
          <div className="col-lg-3 p-2 border border-primary-subtle">
            {capitalizeFirstLetter(dish.userName)}
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle">
            {capitalizeFirstLetter(dish.category)}
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle">
            {capitalizeFirstLetter(dish.name)}
          </div>
          <div className="col-lg-1 p-2 border border-primary-subtle">
            {dish.amount}
          </div>
          <div className="col-lg-2 p-2 border border-primary-subtle">
            {dish.dietary?.map((diet, index, arr) => {
              // last item has no comma after it
              return index === arr.length - 1 ? diet : `${diet}, `;
            })}
          </div>
          <EditDeleteDishMenu selectedEvent={selectedEvent} dish={dish} />
        </div>
      ))}

      {/* xs screens only */}
      {eventDishes.map((dish: DishDocumentType) => (
        <div className="row d-flex d-lg-none" key={dish._id?.toString()}>
          <div className="col-xs p-2 border border-primary-subtle">
            <div className="row">
              <div className="col-4">
                <strong>Chef: </strong>
              </div>
              <div className="col-8 ms-auto">
                {capitalizeFirstLetter(dish.userName)}
              </div>
            </div>
          </div>
          <div className="col-xs p-2 border border-primary-subtle">
            <div className="row">
              <div className="col-4">
                <strong>Category: </strong>
              </div>
              <div className="col-8 ms-auto">
                {capitalizeFirstLetter(dish.category)}
              </div>
            </div>
          </div>
          <div className="col-xs p-2 border border-primary-subtle">
            <div className="row">
              <div className="col-4">
                <strong>Dish Name: </strong>
              </div>
              <div className="col-8 ms-auto">
                {capitalizeFirstLetter(dish.name)}
              </div>
            </div>
          </div>
          <div className="col-xs p-2 border border-primary-subtle">
            <div className="row">
              <div className="col-4">
                <strong>Amount: </strong>
              </div>
              <div className="col-8 ms-auto">{dish.amount} </div>
            </div>
          </div>
          <div className="col-xs p-2 border border-primary-subtle">
            <div className="row">
              <div className="col-4">
                <strong>Dietary: </strong>
              </div>
              <div className="col-8 ms-auto">
                {dish.dietary?.map((diet, index, arr) => {
                  // last item has no comma after it
                  return index === arr.length - 1 ? diet : `${diet}, `;
                })}
              </div>
            </div>
          </div>
          <EditDeleteDishMenu selectedEvent={selectedEvent} dish={dish} />
        </div>
      ))}
    </div>
  );
};

export default DishList;

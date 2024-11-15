import { useQueryClient } from "@tanstack/react-query";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import { EventDocumentType } from "../interfaces/interfaces";
import EditDeleteBevMenu from "./EditDeleteBevMenu";

interface Props {
  selectedEvent: EventDocumentType;
  selectedBevCategory: string;
  // onDelete: (id: number) => void;
}

const BevList = ({ selectedEvent, selectedBevCategory }: Props) => {
  if (selectedEvent.bevs === undefined) return null;

  const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full bev objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, status, refetch, error } = useEventSubDoc(
    selectedEvent.publicId,
    "bev"
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const eventBevs = visibleItemsFilterHelper(
    data,
    selectedBevCategory,
    "All Beverage Categories"
  );

  // refetch();

  return (
    <>
      <div className="container border border-2 border-primary-subtle">
        <div className="row bg-primary-subtle" key="header">
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Libationer</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Category</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Beverage Name</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle">
            <strong>Amount</strong>
          </div>
          <div className="col-sm p-2 border border-primary-subtle d-none d-sm-block"></div>
        </div>

        {eventBevs.map((bev) => (
          <div className="row" key={bev.publicId}>
            <div className="col-sm p-2 border border-primary-subtle">
              {capitalizeFirstLetter(bev.userName)}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              {capitalizeFirstLetter(bev.category)}
            </div>
            <div className="col-sm p-2 border border-primary-subtle">
              {capitalizeFirstLetter(bev.name)}
            </div>

            <div className="col-sm p-2 border border-primary-subtle">
              {bev.amount}
            </div>
            <EditDeleteBevMenu selectedEvent={selectedEvent} bev={bev} />
          </div>
        ))}
      </div>
    </>
  );
};

export default BevList;

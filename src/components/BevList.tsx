import { Bev, Event } from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  selectedEvent: Event;
  selectedBevCategory: string;
  // onDelete: (id: number) => void;
}

const BevList = ({ selectedEvent, selectedBevCategory }: Props) => {
  if (selectedEvent.bevs === undefined) return null;

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full bev objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, status, refetch } = useEventSubDoc(
    selectedEvent.publicId
  );

  const eventBevs = visibleItemsFilterHelper(
    data,
    selectedBevCategory,
    "All Beverage Categories"
  );

  return (
    <table className="table table-bordered" key="bevTable">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody key="bevTableBody">
        {eventBevs.map((bev) => (
          <tr key={bev.publicId}>
            <td>{capitalizeFirstLetter(bev.category)}</td>
            <td>{capitalizeFirstLetter(bev.name)}</td>
            <td>{bev.amount}</td>
          </tr>
        ))}
      </tbody>
      {/* <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tfoot> */}
    </table>
  );
};

export default BevList;

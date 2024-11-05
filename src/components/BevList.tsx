import { BevDocumentType, EventDocumentType } from "../interfaces/interfaces";
import {
  capitalizeFirstLetter,
  visibleItemsFilterHelper,
} from "../functions/functions";
import useEventSubDoc from "../hooks/useEventSubDoc";
import { useQueryClient } from "@tanstack/react-query";
import useDeleteBev from "../hooks/useDeleteBev";

interface Props {
  selectedEvent: EventDocumentType;
  selectedBevCategory: string;
  // onDelete: (id: number) => void;
}

const BevList = ({ selectedEvent, selectedBevCategory }: Props) => {
  if (selectedEvent.bevs === undefined) return null;

  const {
    data: deleteBevData,
    error: deleteBevError,
    isError: deleteBevIsError,
    isPending: deleteBevIsPending,
    isSuccess: deleteBevIsSuccess,
    mutate: deleteBevMutate,
    mutateAsync: deleteBevMutateAsync,
    reset: deleteBevReset,
    status: deleteBevStatus,
  } = useDeleteBev();

  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["selectedEvent"] });

  // get array of full bev objects from selectedEvent by using its publicId
  // returns UseQueryResult
  const { data, isLoading, status, refetch, error } = useEventSubDoc(
    selectedEvent.publicId,
    "bev"
  );

  if (error) return error.message;

  const eventBevs = visibleItemsFilterHelper(
    data,
    selectedBevCategory,
    "All Beverage Categories"
  );

  // refetch();

  return (
    <table className="table table-bordered" key="bevTable">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody key="bevTableBody">
        {eventBevs.map((bev) => (
          <tr key={bev.publicId}>
            <td>{capitalizeFirstLetter(bev.category)}</td>
            <td>{capitalizeFirstLetter(bev.name)}</td>
            <td>{bev.amount}</td>
            <td>&nbsp;</td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={async () => {
                  if (selectedEvent._id === undefined)
                    throw new Error("selectedEvent._id is undefined");
                  if (bev._id === undefined)
                    throw new Error("bev._id is undefined");

                  const result = await deleteBevMutateAsync({
                    eventId: selectedEvent._id.toString(),
                    itemId: bev._id.toString(),
                    itemKind: "bev",
                  });
                  console.log(result);
                }}
              >
                Delete
              </button>
            </td>
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

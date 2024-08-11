import { Dish } from "../interfaces/interfaces";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient<Dish>("/genres");

// hiding endpoint details behind useGenres hook, not in GenreList
// const useGenres = () => useData<Genre>("/genres");

// const useGenres = () => ({ data: genres, isLoading: false, error: null });

const useGenres = () =>
  useQuery({
    queryKey: ["genres"],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Genre>>("/genres").then((res) => res.data),
    queryFn: apiClient.getAll,

    staleTime: ms("24h"),
    initialData: genres,
  });

export default useGenres;

interface Props {
  dishes: Dish[];
  // onDelete: (id: number) => void;
}

const DishList = ({ dishes }: Props) => {
  if (dishes.length === 0) return null;

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
          <th>Dietary</th>
        </tr>
      </thead>
      <tbody>
        {dishes.map((dish) => (
          <tr key={dish.id}>
            <td>{dish.category}</td>
            <td>{dish.name}</td>
            <td>{dish.amount}</td>
            <td>
              {dish.dietary?.map((diet, index, arr) => {
                return index === arr.length - 1 ? diet : `${diet}, `;
              })}
            </td>
            {/* <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDelete(dish.id)}
              >
                Delete
              </button> 
            </td> */}
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

export default DishList;

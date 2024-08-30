import { Bev } from "../interfaces/interfaces";
import useBevs from "../hooks/useBevs";

interface Props {
  selectedBevCategory: string;
  // onDelete: (id: number) => void;
}

function visibleItemsFilterHelper(
  arr: Bev[] | undefined,
  selCat: string,
  allCats: string
) {
  if (arr === undefined) return [];
  if (selCat === allCats) return arr;

  return selCat
    ? arr.filter((element: Bev) => element.category === selCat)
    : arr;
}

const BevList = ({ selectedBevCategory }: Props) => {
  // if (bevs.length === 0) return null;

  const { data, isLoading, error } = useBevs();

  // if bevs is undefined, value will be []
  const visibleBevs = visibleItemsFilterHelper(
    data,
    selectedBevCategory,
    "All Beverage Categories"
  );

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {visibleBevs.map((bev) => (
          <tr key="">
            <td>{bev.category}</td>
            <td>{bev.name}</td>
            <td>{bev.amount}</td>
            {/* <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => onDelete(bev.id)}
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

export default BevList;

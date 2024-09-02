import { Bev } from "../interfaces/interfaces";
import useBevs from "../hooks/useBevs";

interface Props {
  bevs: Bev[];
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

const BevList = ({ bevs }: Props) => {
  if (bevs.length === 0) return null;

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
        {bevs.map((bev) => (
          <tr key={bev.publicId}>
            <td>{bev.category}</td>
            <td>{bev.name}</td>
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

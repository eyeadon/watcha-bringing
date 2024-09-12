import { Bev } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  bevs: Bev[];
  // onDelete: (id: number) => void;
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

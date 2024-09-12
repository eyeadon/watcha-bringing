import { Bev } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  bevs: Bev[];
  // onDelete: (id: number) => void;
}

const BevList = ({ bevs }: Props) => {
  if (bevs.length === 0) return null;

  bevs.forEach((bev) => {
    bev.category = capitalizeFirstLetter(bev.category);
    bev.name = capitalizeFirstLetter(bev.name);
  });

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

import { Bev } from "../interfaces/interfaces";

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
          <tr key={bev.id}>
            <td>{bev.category}</td>
            <td>{bev.name}</td>
            <td>{bev.amount}</td>
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

export default BevList;

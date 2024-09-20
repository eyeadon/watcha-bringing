import { ReactNode, useState } from "react";
import { PlusLg, DashLg } from "react-bootstrap-icons";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSectionButton = ({ children, buttonLabelText }: Props) => {
  const [isExpanded, setExpanded] = useState(false); // false -> + icon

  const showDiv = isExpanded ? children : null;

  const renderIcon = isExpanded ? (
    <DashLg key="dashlg" color="white" />
  ) : (
    [<PlusLg key="pluslg" color="white" className="me-1" />, buttonLabelText]
  );

  return (
    <>
      <div className="col-sm mb-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setExpanded(!isExpanded)}
        >
          {renderIcon}
        </button>
        {showDiv}
      </div>
    </>
  );
};

export default ExpandableSectionButton;

import { ReactNode, useState } from "react";
import { PlusLg, DashLg } from "react-bootstrap-icons";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSectionButton = ({ children, buttonLabelText }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false); // false -> + icon

  const showDiv = isExpanded ? children : null;

  const renderIcon = isExpanded ? (
    <DashLg key="dashlg" color="white" />
  ) : (
    [<PlusLg key="pluslg" color="white" className="me-1" />, buttonLabelText]
  );

  return (
    <>
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {renderIcon}
      </button>
      {showDiv}
    </>
  );
};

export default ExpandableSectionButton;

import { ReactNode, useState } from "react";
import { PlusLg, DashLg } from "react-bootstrap-icons";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSection = ({ children, buttonLabelText }: Props) => {
  const [isExpanded, setExpanded] = useState(false); // false -> + icon

  const showDiv = isExpanded ? children : null;

  const renderIcon = isExpanded ? (
    <DashLg color="white" />
  ) : (
    // was making whole thing a string by + buttonLabelText
    [<PlusLg color="white" />, " ", buttonLabelText]
  );

  return (
    <>
      <div className="mb-3">
        <button
          id="myButton"
          type="button"
          className="btn btn-primary"
          onClick={() => setExpanded(!isExpanded)}
        >
          {renderIcon}
        </button>
      </div>
      {showDiv}
    </>
  );
};

export default ExpandableSection;

import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  buttonLabelText: string;
}

const ExpandableSection = ({ children, buttonLabelText }: Props) => {
  const [isExpanded, setExpanded] = useState(false); // false -> + icon

  const showDiv = isExpanded ? children : null;

  return (
    <>
      <div className="mb-3">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setExpanded(!isExpanded)}
        >
          {isExpanded ? "-" : "+ " + buttonLabelText}
        </button>
      </div>
      {showDiv}
    </>
  );
};

export default ExpandableSection;

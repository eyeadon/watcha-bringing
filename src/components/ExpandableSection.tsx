import { useState } from "react";

interface Props {
  children: string;
}

const ExpandableSection = ({ children }: Props) => {
  const [isExpanded, setExpanded] = useState(false); // false -> +

  const showDiv = isExpanded ? children : null;

  return (
    <p>
      {showDiv}
      <button onClick={() => setExpanded(!isExpanded)}>
        {isExpanded ? "Less" : "More"}
      </button>
    </p>
  );
};

export default ExpandableSection;

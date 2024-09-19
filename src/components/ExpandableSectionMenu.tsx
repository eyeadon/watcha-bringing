import { ReactNode, useState } from "react";
import { Event } from "../interfaces/interfaces";
import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  children: ReactNode;
  menuArray: Event[];
}

const ExpandableSectionMenu = ({ children, menuArray }: Props) => {
  const [isExpanded, setExpanded] = useState(false); // false -> + icon

  const showDiv = isExpanded ? children : null;

  return (
    <>
      <div className="mb-3">
        {menuArray.map((menuItem) => (
          <p>
            <a href="#" onClick={() => setExpanded(!isExpanded)}>
              {capitalizeFirstLetter(menuItem.name)}
            </a>
          </p>
        ))}
      </div>
      {showDiv}
    </>
  );
};

export default ExpandableSectionMenu;

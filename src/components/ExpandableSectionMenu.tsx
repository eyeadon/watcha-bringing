import { ReactNode, useState } from "react";
import { Event } from "../interfaces/interfaces";
// import { capitalizeFirstLetter } from "../functions/functions";

interface Props {
  children: ReactNode;
  selectedEvent?: Event;
}

const ExpandableSectionMenu = ({ children, selectedEvent }: Props) => {
  // const [isExpanded, setExpanded] = useState(false); // false -> + icon

  const showDiv = selectedEvent ? children : null;

  return <>{showDiv}</>;
};

export default ExpandableSectionMenu;

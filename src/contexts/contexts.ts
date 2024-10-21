import { createContext } from "react";

export const EventFormIsExpandedContext = createContext({
  EventFormisExpanded: false,
  setIsExpanded: (isExpanded: boolean) => {
    console.log("EventFormIsExpandedContext initial value used:", isExpanded);
  },
});

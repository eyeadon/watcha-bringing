import { createContext } from "react";
import { emptyEvent } from "../constants/constants.js";
import { EventDocumentType } from "../interfaces/interfaces.js";

export const EventFormIsExpandedContext = createContext({
  eventFormIsExpanded: false,
  setEventFormIsExpanded: (isExpanded: boolean) => {
    console.log("EventFormIsExpandedContext initial value used:", isExpanded);
  },
});

export const SelectedEventContext = createContext({
  selectedEvent: emptyEvent,
  setSelectedEvent: (event: EventDocumentType) => {
    console.log("SelectedEventContext initial value used:", event);
  },
});

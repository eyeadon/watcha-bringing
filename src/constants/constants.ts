import { EventDocumentType, UserDocumentType } from "../interfaces/interfaces";

export const emptyEvent: EventDocumentType = {
  publicId: "none",
  name: "",
  host: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipcode: "",
  },
  startDateTime: new Date(),
  endDateTime: new Date(),
  dishes: [],
  bevs: [],
};

export const emptyUser: UserDocumentType = {
  publicId: "none",
  name: "",
  email: "",
  isAdmin: false,
  eventsOwned: [],
  dishesOwned: [],
  bevsOwned: [],
};

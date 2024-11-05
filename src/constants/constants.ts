import { EventDocumentType } from "../interfaces/interfaces";

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

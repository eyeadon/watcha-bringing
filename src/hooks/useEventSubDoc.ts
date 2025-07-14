import { useQuery } from "@tanstack/react-query";
import { DishDocumentType } from "../interfaces/interfaces.js";
import APIClient from "../services/apiClient.js";

const apiClient = new APIClient<DishDocumentType[]>("/events");

const useEventSubDoc = (eventPublicId: string, itemKind: string) =>
  useQuery({
    queryKey: ["selectedEvent", eventPublicId, itemKind],
    // queryFn: () =>
    //   apiClient.get<FetchResponse<Event>>("/events").then((res) => res.data),
    queryFn: () => apiClient.getSubDoc(eventPublicId, itemKind),
    staleTime: 0,
    // refetchInterval: ( query) => {return query}
    // enabled: false,
  });

export default useEventSubDoc;

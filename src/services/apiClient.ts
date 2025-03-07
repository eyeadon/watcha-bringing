import axios, { AxiosRequestConfig } from "axios";

// export interface FetchResponse<T> {
//   count: number;
//   next: string | null;
//   results: T[];
// }

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // *this* issue with callbacks, could do the following in constructor
  // if it's a regular function:
  // this.getAll = this.getAll.bind(this);

  //  returns response object
  // arrow functions do not have their own *this* context
  getAll = (config: AxiosRequestConfig) => {
    return (
      axiosInstance
        // config is for passing config object of query string params to back end
        // config is optional in get
        // .get<FetchResponse<T>>(this.endpoint, config)
        // added <T[]> here, not using FetchResponse<T>
        .get<T[]>(this.endpoint, config)
        .then((res) => res.data)
      // .catch((error) => {
      //   console.log(error);
      //   return undefined;
      // })
    );
  };

  // get single object
  get = (id: number | string) => {
    return axiosInstance
      .get<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
    // .catch((error) => {
    //   console.log(error);
    //   return undefined;
    // });
  };

  // get single object by publicId
  getSingleByPublicId = (id: number | string) => {
    return axiosInstance
      .get<T>(this.endpoint + "/public/" + id)
      .then((res) => res.data);
    // .catch((error) => {
    //   console.log(error);
    //   return undefined;
    // });
  };

  // get single object by email
  getSingleByEmail = (email: string) => {
    return axiosInstance
      .get<T>(this.endpoint + "/email/" + email)
      .then((res) => res.data);
    // .catch((error) => {
    //   console.log(error);
    //   return undefined;
    // });
  };

  // get sub doc
  getSubDoc = (id: number | string, itemKind: string) => {
    return axiosInstance
      .get<T>(this.endpoint + "/subdoc/items", {
        params: { publicId: id, itemKind: itemKind },
      })
      .then((res) => res.data);
    // .catch((error) => {
    //   console.log(error);
    //   return undefined;
    // });
  };

  post = (data: T) => {
    return (
      axiosInstance
        // .post<FetchResponse<T>>(this.endpoint, data)
        .post<T>(this.endpoint, data)
        .then((res) => res.data)
      // .catch((error) => {
      //   console.log(error);
      //   return undefined;
      // })
    );
  };

  put = (id: number | string, data: T) => {
    return (
      axiosInstance
        // .put<FetchResponse<T>>(this.endpoint + "/" + id, data)
        .put<T>(this.endpoint + "/" + id, data)
        .then((res) => res.data)
      // .catch((error) => {
      //   console.log(error);
      //   return undefined;
      // })
    );
  };

  delete = (id: number | string) => {
    return axiosInstance
      .delete<T>(this.endpoint + "/" + id)
      .then((res) => res.data);
    // .catch((error) => {
    //   console.log(error);
    //   return undefined;
    // });
  };

  deleteItem = (eventId: number | string, itemId: string, itemKind: string) => {
    return axiosInstance
      .delete<T>(this.endpoint + "/subdoc/deleteitem", {
        params: { eventId: eventId, itemId: itemId, itemKind: itemKind },
      })
      .then((res) => res.data);
    // .catch((error) => {
    //   console.log(error);
    //   return undefined;
    // });
  };
}

export default APIClient;

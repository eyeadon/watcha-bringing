import { RouteObject } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import AdminHomePage from "./pages/admin/AdminHomePage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import UserLayout from "./pages/user/UserLayout.tsx";
import { UserPage } from "./pages/user/UserPage.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      // { index: true, element: <HomePage or OtherContent /> },
      {
        path: "user",
        element: <UserLayout />,
        children: [{ index: true, element: <UserPage /> }],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminHomePage /> }],
      },
    ],
  },
];

export default routes;

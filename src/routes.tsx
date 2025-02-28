import { RouteObject } from "react-router-dom";
import App from "./App.tsx";
import HomePage from "./pages/HomePage.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import AdminHomePage from "./pages/admin/AdminHomePage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminHomePage /> }],
      },
    ],
  },
];

export default routes;

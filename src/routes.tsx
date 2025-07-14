import { RouteObject } from "react-router-dom";
import App from "./App.js";
import ErrorPage from "./pages/ErrorPage.js";
import AdminHomePage from "./pages/admin/AdminHomePage.js";
import AdminLayout from "./pages/admin/AdminLayout.js";
import UserLayout from "./pages/user/UserLayout.js";
import { UserPage } from "./pages/user/UserPage.js";
import Layout from "./pages/Layout.js";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <App /> },
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

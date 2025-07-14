import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.js";
import AuthProvider from "../providers/AuthProvider.js";

const Layout = () => {
  return (
    <AuthProvider>
      <NavBar />
      <main className="">
        <Outlet />
      </main>
    </AuthProvider>
  );
};

export default Layout;

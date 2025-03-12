import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import AuthProvider from "../providers/AuthProvider";

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

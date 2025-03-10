import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <>
      <NavBar />
      <main className="">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;

import Sidebar from "@/components/sidebar/Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
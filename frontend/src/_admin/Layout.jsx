import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../App.css";
import Header from "../components/_admin/Navbar/Header";
import Sidebar from "../components/_admin/Sidebar/Sidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={`flex h-screen bg-neutral-50 dark:bg-gray-900 overflow-hidden;
      }`}
    >
      {/* <Sidebar /> */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* <Header /> */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <Outlet /> */}

        <main>
          <div className="text-[#1C2434] mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 dark:text-white">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

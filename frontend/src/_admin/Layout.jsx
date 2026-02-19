import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../App.css";
import Header from "../components/_admin/Navbar/Header";
import Sidebar from "../components/_admin/Sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <div
        className={`flex h-screen bg-page overflow-hidden;
      }`}
      >
        {/* <Sidebar /> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* <Header /> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <Outlet /> */}

          <main>
            <div className="text-text mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </div>
  );
};

export default AdminLayout;

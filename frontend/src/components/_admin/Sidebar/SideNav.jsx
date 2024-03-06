import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import user from "../../../assets/user.svg";
import Shipping from "../../../assets/shipment.svg";
import { AiOutlineLogout } from "react-icons/ai";
import { useLogout } from "../../../hooks/useLogout";
import { useAuthContext } from "../../../hooks/useAuthContext";
import {
  VendorOtherRoutes,
  roleRoutes,
  vendorsRoutes,
} from "../../../utiliz";

const SideNav = ({ sidebarOpen, setSidebarOpen }) => {
  const { auth } = useAuthContext();
  let role = auth?.role_name;
  const location = useLocation();
  const { pathname } = location;
  const { logout } = useLogout();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-[18rem] flex-col overflow-y-hidden bg-slate-800 text-white duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 pt-3 px-6 py-5.5 lg:py-5.5">
        <Link
          className="flex justify-center items-center gap-4"
          to="/dashboard"
        >
          <img
            src="https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZ298ZW58MHx8MHx8fDA%3D"
            className="flex justify-center items-center h-12 w-12 rounded-full"
            alt="Logo"
          />
          <span className="font-bold text-xl">Dashboard</span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill="#FFF"
            />
          </svg>
        </button>
      </div>

      {/* Header Sidebar */}
      <div className="no-scrollbar flex flex-col overflow-y-hidden duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-4">
          {/* <!-- Menu Group --> */}

          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {vendorsRoutes?.map((route) => (
                <li key={route.path}>
                  {!route?.subRoutes ? (
                    <Link
                      to={route.path}
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("calendar") &&
                        "bg-graydark dark:bg-meta-4"
                      }`}
                    >
                      {route.icon && <route.icon />}
                      {route.image && (
                        <img
                          src={route.image}
                          alt={route.title}
                          className="h-4 w-4"
                        />
                      )}
                      {route.title}
                    </Link>
                  ) : (
                    <SidebarLinkGroup
                      activeCondition={
                        pathname === "/shipping" ||
                        pathname.includes("shipping" || "returns")
                      }
                    >
                      {(handleClick, open) => {
                        return (
                          <React.Fragment>
                            <Link
                              to="#"
                              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                (pathname === "/shipping" ||
                                  pathname === "/returns" ||
                                  pathname.includes("shipping" || "returns")) &&
                                "bg-graydark dark:bg-meta-4"
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                sidebarExpanded
                                  ? handleClick()
                                  : setSidebarExpanded(true);
                              }}
                            >
                              <img
                                src={Shipping}
                                alt="Orders"
                                className="h-5 w-5"
                              />
                              {route.title}
                              <svg
                                className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                  open && "rotate-180"
                                }`}
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                  fill=""
                                />
                              </svg>
                            </Link>

                            {route.subRoutes && (
                              <div
                                className={`translate transform overflow-hidden ${
                                  !open && "hidden"
                                }`}
                              >
                                <ul className="text-bodydark mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                                  {route.subRoutes.map((subRoute, subIndex) => (
                                    <li
                                      key={subIndex}
                                      className="relative flex flex-col hover:text-white"
                                    >
                                      <Link
                                        to={subRoute.path}
                                        className={({ isActive }) =>
                                          "group relative flex flex-row justify-between items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                          (isActive && "text-white")
                                        }
                                      >
                                        <span className="flex items-center gap-2.5">
                                          {subRoute.icon && <subRoute.icon />}
                                          {subRoute.image && (
                                            <img
                                              src={subRoute.image}
                                              alt={subRoute.title}
                                              className="h-4 w-4"
                                            />
                                          )}
                                          {subRoute.title}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      }}
                    </SidebarLinkGroup>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* <!-- Roles And Permissions Menu */}
          {role === "admin" && (
            <div>
              <h3 className="mb-4 ml-4 text-md font-semibold text-bodydark2 border-b">
                Roles and Permisisions
              </h3>

              {roleRoutes?.map((route) => (
                <ul key={route.title} className="mb-6 flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === "/dashboard/users" ||
                      pathname.includes("users")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === "/dashboard/users" ||
                                pathname.includes("users")) &&
                              "bg-graydark dark:bg-meta-4"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <img src={user} alt="Users" className="h-6 w-6" />
                            {route.title}
                            <svg
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                open && "rotate-180"
                              }`}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill=""
                              />
                            </svg>
                          </Link>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && "hidden"
                            }`}
                          >
                            {route?.subRoutes &&
                              route.subRoutes?.map((subRoute) => (
                                <ul
                                  key={subRoute?.title}
                                  className="mt-4 mb-0.5 flex flex-col gap-2.5 pl-6 text-bodydark"
                                >
                                  <li className="ml-5 hover:text-white">
                                    <Link
                                      to={subRoute?.path}
                                      className={({ isActive }) =>
                                        "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                        (isActive && "!text-white")
                                      }
                                    >
                                      {subRoute?.title}
                                    </Link>
                                  </li>
                                </ul>
                              ))}
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                </ul>
              ))}
            </div>
          )}
          {/* <!-- Others Group --> */}
          <div className="py-2 ">
            <h3 className="mb-4 ml-4 text-md font-semibold text-bodydark2 border-b">
              Account
            </h3>

            {VendorOtherRoutes?.map((route) => (
              <ul key={route.title} className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Account Pages --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/profile" ||
                    pathname.includes("profile" || "notifications")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <Link
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === "/profile" ||
                              pathname === "/notifications" ||
                              pathname.includes(
                                "profile" || "notifications"
                              )) &&
                            "bg-graydark dark:bg-meta-4"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          {route.title}
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && "rotate-180"
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </Link>

                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          {route.subRoutes && (
                            <ul className="text-bodydark mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              {route.subRoutes.map((subRoute, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="relative flex flex-col hover:text-white"
                                >
                                  <Link
                                    to={subRoute.path}
                                    className={({ isActive }) =>
                                      "group relative flex flex-row justify-between items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                      (isActive && "text-white")
                                    }
                                  >
                                    <span className="flex items-center gap-2.5">
                                      {subRoute.icon && <subRoute.icon />}
                                      {subRoute.image && (
                                        <img
                                          src={subRoute.image}
                                          alt={subRoute.title}
                                          className="h-4 w-4"
                                        />
                                      )}
                                      {subRoute.title}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}

                          <ul className="ml-4 mt-4 flex flex-col gap-1.5">
                            <li className="hover:text-white active:text-white">
                              <Link
                                to="#"
                                onClick={logout}
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                <span className="flex items-center gap-2.5">
                                  <AiOutlineLogout style={{ color: "#FFF" }} />{" "}
                                  Logout
                                </span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>

                {/* <!-- Menu Item account Pages --> */}
              </ul>
            ))}
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default SideNav;

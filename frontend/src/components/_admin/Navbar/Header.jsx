import { Link } from "react-router-dom";
import DropdownUser from "../Account/DropDownProfileMenu";
import { HiMenuAlt1 } from "react-icons/hi";
import DropdownNotification from "./DropdownNotification";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    // <header className="sticky top-0 left-0 z-999 flex w-full drop-shadow-1 dark:bg-[#24303F] dark:drop-shadow-none">
    <header className="sticky top-0 left-0 z-70 flex w-full shadow-lg dark:bg-[#24303F] dark:drop-shadow-none bg-white">
      <div className="flex flex-grow items-center justify-between py-4 px-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-[#E2E8F0] bg-neutral-100 p-1.5 shadow-sm dark:border-[#2E3A47] dark:bg-[#24303F] lg:hidden"
          >
            {/* <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-[#1C2434] delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-[#1C2434] delay-150 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-[#1C2434] delay-200 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-[#1C2434] delay-300 duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-[#1C2434] duration-200 ease-in-out dark:bg-white ${
                    !sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span> */}
            <HiMenuAlt1
              style={{ background: "transparent", border: "none" }}
              className="text-black dark:text-white"
            />
          </button>
          {/* <!-- Hamburger Toggle BTN END--> */}

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <img
              src="https://plus.unsplash.com/premium_photo-1661914978519-52a11fe159a7?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="h-12 w-12 rounded-full"
              alt="Logo"
            />
          </Link>
        </div>

        {/* / Search/ */}
        <div className="hidden sm:block"></div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />
            {/* <!-- Notification Menu Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

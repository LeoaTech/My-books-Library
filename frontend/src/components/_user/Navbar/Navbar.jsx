import React, { useState, useEffect } from "react";
import { SignedOut } from "@gadgetinc/react";
import {
  HiMenu,
  HiOutlineX,
  HiOutlineShoppingCart,
  HiShoppingCart,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useUser, useSignOut } from "@gadgetinc/react";
import { api } from "../../../api";

const Navbar = () => {
  const user = useUser(api);
  const signOut = useSignOut();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSticky, setStickyNav] = useState(false);
  const onToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 150) {
        setStickyNav(true);
      } else {
        setStickyNav(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const headerLinks = [
    {
      title: "Library",
      path: "/books",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Price",
      path: "/price",
    },
    {
      title: "Trendings",
      path: "/trending",
    },
  ];
  return (
    <header className="w-full bg-white fixed top-0 left-0 right-0 transition-all ease-in duration-300 z-50">
      {/* Left */}
      <nav
        className={`py-6 lg:px-24 px-4 z-50 ${
          isSticky ? "sticky top-0 left-0 right-0 bg-purple-300 shadow-lg" : ""
        }`}
      >
        <div className="flex justify-between items-center text-base gap-8">
          <Link
            onClick={isMenuOpen && onToggle}
            to="/"
            className="text-2xl font-bold text-red-900"
          >
            Book Store
          </Link>
          {/* Centers Links of Header */}

          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
            <ul className="flex flex-wrap -mb-px md:flex space-x-8 sm:hidden">
              <li className="mr-2">
                {headerLinks?.map(({ title, path }) => (
                  <Link
                    to={path}
                    key={path}
                    className="inline-block text-base text-meta-3 uppercase cursor-pointer p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-meta-1 "
                  >
                    {title}
                  </Link>
                ))}
              </li>
            </ul>
          </div>

          {/* <ul className="md:flex space-x-8 hidden">
          {headerLinks?.map(({ title, path }) => (
            <Link
              to={path}
              key={path}
              className="block text-base text-green-900 uppercase cursor-pointer hover:text-red-400"
            >
              {title}
            </Link>
          ))}
        </ul> */}
          {/* Right */}

          {/* <div className="space-x-12 hidden lg:flex items-center">
          <button className="w-5 hover:text-blue-600">
            {" "}
            <HiMenu />
          </button>
        </div> */}

          {/* Menu button for the small screen */}
          <div className="md:hidden">
            <button
              className=" outline-none bg-white border-none text-black focus:outline-none"
              onClick={onToggle}
            >
              {isMenuOpen ? (
                <HiOutlineX className="h-5 w-5 text-black" />
              ) : (
                <HiMenu className="h-5 w-5 text-black" />
              )}
            </button>
          </div>

          <div
            className={`${
              isMenuOpen ? "hidden" : "hidden lg:flex gap-4 items-center"
            }`}
          >
            <Link
              className="block text-base text-blue uppercase cursor-pointer hover:text-red-400"
              to="/cart"
            >
              <HiOutlineShoppingCart className="h-5 w-5 " />{" "}
            </Link>
            <SignedOut>
              <Link
                to="/sign-in"
                className="block text-base text-blue uppercase cursor-pointer hover:text-red-400"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="h-9 flex justify-center items-center px-4 ml-auto text-sm bg-meta-5 text-white rounded-lg text-center px-2 py-1 uppercase cursor-pointer hover:text-white hover:bg-secondary"
              >
                Sign up
              </Link>
            </SignedOut>
            {user && <a onClick={signOut}>Sign Out</a>}
          </div>
        </div>

        {/* Mobile Screen menu */}
        <div
          className={`space-y-8 px-8 mt-16 py-4 bg-slate-600 text-black md:hidden ${
            isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"
          } `}
        >
          {headerLinks?.map(({ title, path }) => (
            <Link
              to={path}
              key={path}
              onClick={onToggle}
              className="block text-base text-white uppercase cursor-pointer p-1 hover:text-salte-400 hover:rounded-lg hover:bg-slate-500"
            >
              {title}
            </Link>
          ))}
          <div
            onClick={onToggle}
            className={`${
              isMenuOpen ? "sm:hidden" : "hidden lg:flex gap-4 items-center"
            }`}
          >
            <Link
              className="flex justify-center- items-center text-base text-white uppercase cursor-pointer p-1 hover:text-salte-400 hover:bg-slate-500 hover:rounded-lg"
              to="/cart"
            >
              <HiOutlineShoppingCart className="h-5 w-5 " /> Cart
            </Link>
            <SignedOut>
              <Link
                to="/sign-in"
                className="h-9 flex justify-center items-center px-4 ml-auto text-sm bg-transparent text-black rounded-lg   text-center px-2 py-1 uppercase cursor-pointer hover:bg-black hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="h-9 flex justify-center items-center px-4 ml-auto text-sm bg-blue-500 text-white rounded-lg text-white-900  text-center px-2 py-1 uppercase cursor-pointer hover:text-white-400 hover:bg-blue-300"
              >
                Sign up
              </Link>
            </SignedOut>
            {user && (
              <a
                onClick={signOut}
                className="h-9 mt-2 flex justify-center items-center px-4 ml-auto text-sm bg-blue-500 text-white rounded-lg text-white-900  text-center px-2 py-1 uppercase cursor-pointer hover:text-white-400 hover:bg-blue-300"
              >
                Sign Out
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

/* 

 // <Link
            //   className="block text-base text-blue uppercase cursor-pointer hover:text-red-400"
            //   to="/login"
            // >
            //   Login
            // </Link>

            // <Link
            //   className="block text-base bg-blue-500 text-white-900  text-center px-2 py-1 uppercase cursor-pointer hover:text-red-400"
            //   to="/signup"
            // >
            //   Get Started
            // </Link>

  // <Link
              //   className="block text-base text-blue uppercase cursor-pointer hover:text-red-400"
              //   to="/login"
              // >
              //   Login
              // </Link>

              // <Link
              //   className="h-9 flex justify-center items-center ml-auto text-sm bg-blue-500 text-white rounded-lg text-white-900  text-center px-2 py-1 uppercase cursor-pointer hover:text-red-400"
              //   to="/signup"
              // >
              //   Get Started
              // </Link>
              {/* <div className="w-full space-y-2 border-primary/10 dark:border-gray-700 flex flex-col -ml-1 sm:flex-row lg:space-y-0 md:w-max lg:border-l">
            <a
              href="#"
              className="relative flex h-9 ml-auto items-center justify-center sm:px-6 before:absolute before:inset-0 before:rounded-full focus:before:bg-primary/10 dark:focus:before:bg-primaryLight/10 before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
            >
              <span className="relative text-sm font-semibold text-primary dark:text-primaryLight">
                Sign Up
              </span>
            </a>
            <a
              href="#"
              className="relative flex h-9 ml-auto items-center justify-center sm:px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary dark:before:bg-primaryLight before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
            >
              <span className="relative text-sm font-semibold text-white dark:text-gray-900">
                Login
              </span>
            </a>
          </div> 
 */

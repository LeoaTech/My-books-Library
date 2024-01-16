import React, { useState } from "react";
import { FaList, FaSort } from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import { HiOutlineViewList } from "react-icons/hi";
import Sidebar from "../../components/_user/Sidebar/Sidebar";
import { books } from "../../components/_user/data";
import BookCard2 from "../../components/_user/Book/BookCard2";
import DetailedBookCard from "../../components/_user/Book/DetailedBookCard";
import SortBooks from "../../components/_user/Filters/SortBooks";

const Library = () => {
  const [layout, setLayout] = useState("grid");
  const sortingOptions = ["Nikola Tesla", "Lorem Ipsanum", "Alber Einstein"];

  const handleGridClick = () => {
    setLayout("grid");
  };

  const handleDetailsClick = () => {
    setLayout("details");
  };

  return (
    <div className="bg-purple-200 flex flex-col">
      {/* <!-- Navbar --> */}
      <header className="relative flex flex-col items-center bg-white px-4 py-4 shadow sm:flex-row md:h-20">
        <div className="flex w-full flex-col justify-between overflow-hidden transition-all sm:max-h-full sm:flex-row sm:items-center">
          <div className="relative ml-10 flex items-center justify-between rounded-md sm:ml-auto">
            <svg
              className="absolute left-2 block h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" className=""></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65" className=""></line>
            </svg>
            <input
              type="name"
              name="search"
              className="h-12 w-full rounded-md border border-gray-100 bg-gray-100 py-4 pr-4 pl-12 shadow-sm outline-none focus:border-blue-500"
              placeholder="Search for anything"
            />
          </div>

          <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
            <li className="">
              <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </li>
            <li className="">
              <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>
            </li>
            <li className="">
              <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </header>

      <div className="flex w-full mt-4 mb-4">
        <Sidebar />
        {/* <!-- Main --> */}
        <div className="h-full">
          <div className="py-4">
            <span className="text-xl ml-4 font-bold">Books</span>
            <span className="flex items-center"></span>
          </div>
          <main id="dashboard-main" className="h-full px-4">
            {/* Navbar with display options and sort */}
            <header className="border border-black relative flex flex-col items-center bg-white px-4 py-4 shadow sm:flex-row md:h-20 mb-8">
              <div className="flex flex-col lg:flex-row md:flex-row w-full justify-between overflow-hidden transition-all sm:max-h-full sm:flex-row sm:items-center">
                {/* display as */}
                <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
                  <li className="relative">
                    <div className="w-full py-2 border border-black rounded">
                      {/* label */}
                      <button
                        onClick={handleDetailsClick}
                        className="w-full flex gap-2 items-center justify-between px-4"
                      >
                        <HiOutlineViewList className={`transition`} />
                        <span>Details View </span>
                      </button>
                    </div>
                  </li>
                  <li className="relative">
                    <div className="w-full py-2 border border-black rounded">
                      {/* label */}
                      <button
                        onClick={handleGridClick}
                        className="w-full flex gap-2 items-center justify-between px-4"
                      >
                        <BsGrid className={`transition`} />
                        <span>Grid View </span>
                      </button>
                    </div>
                  </li>
                </ul>
                {/* sort by */}
                <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
                  {/* <li className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                      <FaList />
                    </button>
                    Categories
                  </li> */}
                  <li className="">
                    <SortBooks />
                  </li>
                </ul>
              </div>
            </header>
            {layout === "grid" && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {/* Simple Book Card View */}
                {books.map((book) => {
                  return <BookCard2 key={book.id} {...book} />;
                })}
              </div>
            )}

            {layout === "details" && (
              <div className="grid grid-cols-1 gap-y-4">
                {/* Detailed Book Card View */}
                {books.map((book) => {
                  return <DetailedBookCard key={book.id} {...book} />;
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Library;

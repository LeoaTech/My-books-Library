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
    <div className="w-full bg-purple-200">
      <div className="mx-auto max-w-screen-lg">
        {/* library head banner and contact section */}
        <div className="w-full">
          <div
            className="relative h-64 rounded-b-lg bg-cover bg-center bg-no-repeat shadow-lg"
            style={{
              backgroundImage:
                "url(https://i.pinimg.com/originals/1e/4c/23/1e4c23b61e5d835705526e1ea09864b0.jpg)",
            }}
          >
            <div className="px-4 pt-8 pb-10">
              <div className="absolute inset-x-0 -bottom-10 mx-auto w-36 rounded-full border-8 border-purple-600 shadow-lg">
                <span className="absolute right-0 m-3 h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2"></span>
                <img
                  className="mx-auto h-auto w-full rounded-full"
                  src="https://png.pngtree.com/template/20190316/ourmid/pngtree-books-logo-image_79143.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-start justify-center space-y-4 py-8 px-4 sm:flex-row sm:space-y-0 md:justify-between lg:px-0">
            <div className="max-w-lg">
              <h1 className="text-2xl font-bold text-gray-800">
                LeoaTech Library
              </h1>
              <p className="mt-2 text-gray-600">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Explicabo, alias. Quas necessitatibus exercitationem
                praesentium.
              </p>
            </div>
            <div className="">
              <button className="flex whitespace-nowrap rounded-lg bg-purple-600 px-6 py-2 font-bold text-white transition hover:translate-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 inline h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Chat with us
              </button>
              <p className="mt-4 flex items-center whitespace-nowrap text-gray-500 sm:justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 inline h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +1 432 923 0001
              </p>
            </div>
          </div>
        </div>

        {/* library body section */}
        <div className="w-full flex flex-col">
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
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
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
      </div>
    </div>
  );
};

export default Library;

import React from "react";
import { FaList, FaSort } from "react-icons/fa";
import { BsGrid } from "react-icons/bs";
import { HiOutlineViewList } from "react-icons/hi";

const DisplayOptionsNavbar = () => {
  return (
    <header className="border border-black relative flex flex-col items-center bg-white px-4 py-4 shadow sm:flex-row md:h-20 mb-8">
      <div className="flex flex-col lg:flex-row md:flex-row w-full justify-between overflow-hidden transition-all sm:max-h-full sm:flex-row sm:items-center">
        <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
          <li className="flex items-center">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
              <HiOutlineViewList />
            </button>
          </li>
          <li className="flex items-center">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
              <BsGrid />
            </button>
          </li>
        </ul>
        <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
          <li className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
              <FaList />
            </button>
            Categories
          </li>
          <li className="flex items-center gap-2">
            <div className="relative">
              <input
                className="hidden"
                type="checkbox"
                name="select-1"
                id="select-1"
                checked
              />
              <label
                htmlFor="select-1"
                className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-400 peer-checked:ring"
              >
                Sort
              </label>
              <FaSort className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-gray-600 transition peer-checked:rotate-180" />
              <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-xl transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                <li className="cursor-pointer px-3 py-2 text-sm text-gray-500 hover:bg-blue-500 hover:text-white">
                  Nikola Tesla
                </li>
                <li className="cursor-pointer px-3 py-2 text-sm text-gray-500 hover:bg-blue-500 hover:text-white">
                  Lorem Ipsanum
                </li>
                <li className="cursor-pointer px-3 py-2 text-sm text-gray-500 hover:bg-blue-500 hover:text-white">
                  Alber Einstein
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default DisplayOptionsNavbar;

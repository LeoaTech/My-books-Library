import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import GenreFilter from "../Filters/GenreFilter";
import PriceFilter from "../Filters/PriceFilter";
import RatingFilter from "../Filters/RatingFilter";
import NewestBooksFilter from "../Filters/NewestBooksFilter";
import FeaturedBooksFilter from "../Filters/FeaturedBooksFilter";
import PublishYearFilter from "../Filters/PublishYearFilter";

const Sidebar = () => {
  return (
    <aside className="fixed z-50 md:relative">
      {/* mobile view icon */}
      <input type="checkbox" className="peer hidden" id="sidebar-open" />
      <label
        className="peer-checked:rounded-full peer-checked:p-2 peer-checked:right-6 peer-checked:bg-gray-600 peer-checked:text-white absolute top-8 z-20 mx-4 cursor-pointer md:hidden"
        htmlFor="sidebar-open"
      >
        <CiFilter />
      </label>
      {/* sidebar content */}
      <nav
        aria-label="Sidebar Navigation"
        className="peer-checked:w-64 left-0 z-10 flex w-0 flex-col transition-all md:w-64 lg:w-72"
      >
        <div className="py-4">
          <span className="text-xl ml-4 font-bold">Filter Options</span>
          <span className="flex items-center"></span>
        </div>
        <ul className="space-y-6 px-4">
          {/* Price Filter */}
          <li className="relative bg-white">
            <PriceFilter />
          </li>

          {/* Genre Filter */}
          <li className="relative bg-white">
            <GenreFilter />
          </li>

          {/* Rating filter */}
          <li className="relative bg-white">
            <RatingFilter />
          </li>

          {/* Year Filter */}
          <li className="relative bg-white">
            <PublishYearFilter />
          </li>

          {/* Newest filter */}
          <li className="relative bg-white">
            <NewestBooksFilter />
          </li>

          {/* Featured Filter */}
          <li className="relative bg-white">
            <FeaturedBooksFilter />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

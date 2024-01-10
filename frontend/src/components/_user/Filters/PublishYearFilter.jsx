import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const PublishYearFilter = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const currentYear = new Date().getFullYear();
  const yearsArray = [];

  for (let year = 2001; year <= currentYear; year++) {
    yearsArray.push({ id: year.toString(), label: year.toString() });
  }

  const publish_years = yearsArray.reverse();

  return (
    <>
      <div className="relative w-full py-3 border border-black">
        {/* dropdown label */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4"
        >
          <span>Select Year</span>
          <IoIosArrowDown
            className={`transition ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {/* dropdown options */}
      <div
        className={`flex border border-black border-t-0 p-4 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        {/* Two columns for genres */}
        <div className="flex space-x-12">
          <div className="flex flex-col space-y-2">
            {publish_years
              .slice(0, Math.ceil(publish_years.length / 2))
              .map((publish_year) => (
                <div key={publish_year.id} className="flex items-center">
                  <input
                    id={`genre_${publish_year.id}`}
                    type="checkbox"
                    name={`type[${publish_year.id}]`}
                    className="h-5 w-5 rounded border-gray-300"
                    defaultChecked={false}
                  />
                  <label
                    htmlFor={`genre_${publish_year.id}`}
                    className="ml-3 text-sm font-medium"
                  >
                    {publish_year.label}
                  </label>
                </div>
              ))}
          </div>
          <div className="flex flex-col space-y-2">
            {publish_years
              .slice(Math.ceil(publish_years.length / 2))
              .map((publish_year) => (
                <div key={publish_year.id} className="flex items-center">
                  <input
                    id={`genre_${publish_year.id}`}
                    type="checkbox"
                    name={`type[${publish_year.id}]`}
                    className="h-5 w-5 rounded border-gray-300"
                    defaultChecked={false}
                  />
                  <label
                    htmlFor={`genre_${publish_year.id}`}
                    className="ml-3 text-sm font-medium"
                  >
                    {publish_year.label}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublishYearFilter;

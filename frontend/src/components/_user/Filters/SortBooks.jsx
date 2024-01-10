import React, { useState } from "react";
import { FaSort } from "react-icons/fa";

const SortBooks = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const options = [
    "Neweset",
    "Oldest",
    "Low to High Price",
    "High to Low Price",
    "Best Seller",
  ];

  return (
    <>
      <div className="relative w-full py-2 border border-black rounded">
        {/* dropdown label */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4 gap-2"
        >
          <span>Sort by </span>
          <FaSort className={`transition`} />
        </button>
      </div>
      {/* dropdown options */}
      <div
        className={`bg-white absolute z-50 top-16 right-8 flex border border-black p-4 ${
          isDropdownOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex bg-purple-300 p-2">
              <h1 className="font-semibold">{option}</h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SortBooks;

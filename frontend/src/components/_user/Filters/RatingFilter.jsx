import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaStar } from "react-icons/fa";

const RatingFilter = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const ratings = [
    { id: "5", label: "5.0" },
    { id: "4", label: "4.0" },
    { id: "3", label: "3.0" },
    { id: "2", label: "2.0" },
    { id: "1", label: "1.0" },
  ];

  return (
    <>
      <div className="relative w-full py-3 border border-black">
        {/* dropdown label */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4"
        >
          <span>Rating</span>
          <IoIosArrowDown
            className={`transition ${isDropdownOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>
      {/* dropdown options */}
      <div
        className={`flex border border-black border-t-0 p-4 ${
          isDropdownOpen ? "hidden" : "block"
        }`}
      >
        <div className="flex flex-col space-y-2">
          {ratings.map((rating) => (
            <div key={rating.id} className="flex items-center">
              <input
                id={`genre_${rating.id}`}
                type="checkbox"
                name={`type[${rating.id}]`}
                className="h-5 w-5 rounded border-gray-300"
                defaultChecked={false}
              />
              <label
                htmlFor={`genre_${rating.id}`}
                className="ml-3 text-sm font-medium flex items-center"
              >
                {[...Array(parseInt(rating.label, 10))].map((_, index) => (
                  <span key={index} className="mr-2 text-yellow-500">
                    <FaStar />
                  </span>
                ))}
                {rating.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RatingFilter;

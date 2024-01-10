import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { GiPayMoney } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import { MdAttachMoney } from "react-icons/md";

const PriceFilter = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <div className="relative w-full py-3 border border-black">
        {/* dropdown label */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4"
        >
          <span>Price Range</span>
          <IoIosArrowDown
            className={`transition ${isDropdownOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>
      {/* dropdown options */}
      <div
        className={`flex border border-black border-t-0 p-2 ${
          isDropdownOpen ? "hidden" : "block"
        }`}
      >
        <div className="flex items-center gap-4 mt-4">
          <GiPayMoney className="mt-7 text-4xl text-purple-900" />
          <div className="relative">
            <input
              className="accent-purple-900 h-2 w-full appearance-none rounded-full bg-purple-300"
              value="0"
              type="range"
              name=""
              id=""
            />
            <div className="absolute -top-9 -left-2 h-8 w-8 rounded-full rounded-br-none bg-yellow-400 rotate-45">
              <MdAttachMoney className="absolute top-2 right-1 left-2 text-1xl -rotate-45" />
            </div>
          </div>
          <GiReceiveMoney className="mb-4 text-4xl text-purple-900" />
        </div>
      </div>
    </>
  );
};

export default PriceFilter;

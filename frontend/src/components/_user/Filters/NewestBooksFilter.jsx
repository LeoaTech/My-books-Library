import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const NewestBooksFilter = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const books = [
    { id: "5", title: "1 It Starts with Us" },
    { id: "4", title: "2 It Starts with Us" },
    { id: "3", title: "3 It Starts with Us" },
    { id: "2", title: "4 It Starts with Us" },
    { id: "1", title: "5 It Starts with Us" },
  ];

  return (
    <>
      <div className="relative w-full py-3 border border-black">
        {/* dropdown label */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4"
        >
          <span>Newest Books (21)</span>
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
        <div className="flex flex-col space-y-2">
          {books.map((book) => (
            <div key={book.id} className="flex items-center">
              <h1>{book.title}</h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewestBooksFilter;

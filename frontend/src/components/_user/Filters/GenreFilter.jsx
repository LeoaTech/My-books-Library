import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const GenreFilter = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const genres = [
    { id: "Action", label: "Action" },
    { id: "Fantasy", label: "Fantasy" },
    { id: "Crime", label: "Crime" },
    { id: "Suspense", label: "Suspense" },
    { id: "Thriller", label: "Thriller" },
    { id: "Health", label: "Health" },
    { id: "Biography", label: "Biography" },
    { id: "Romance", label: "Romance" },
    { id: "Comedy", label: "Comedy" },
    { id: "Documentary", label: "Documentary" },
    { id: "Sci-fi", label: "Sci-fi" },
    { id: "Sports", label: "Sports" },
  ];

  return (
    <>
      <div className="relative w-full py-3 border border-black">
        {/* dropdown label */}
        <button
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4"
        >
          <span>Select Genre</span>
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
        {/* Two columns for genres */}
        <div className="flex space-x-4">
          <div className="flex flex-col space-y-2">
            {genres.slice(0, Math.ceil(genres.length / 2)).map((genre) => (
              <div key={genre.id} className="flex items-center">
                <input
                  id={`genre_${genre.id}`}
                  type="checkbox"
                  name={`type[${genre.id}]`}
                  className="h-5 w-5 rounded border-gray-300"
                  defaultChecked={false}
                />
                <label
                  htmlFor={`genre_${genre.id}`}
                  className="ml-3 text-sm font-medium"
                >
                  {genre.label}
                </label>
              </div>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            {genres.slice(Math.ceil(genres.length / 2)).map((genre) => (
              <div key={genre.id} className="flex items-center">
                <input
                  id={`genre_${genre.id}`}
                  type="checkbox"
                  name={`type[${genre.id}]`}
                  className="h-5 w-5 rounded border-gray-300"
                  defaultChecked={false}
                />
                <label
                  htmlFor={`genre_${genre.id}`}
                  className="ml-3 text-sm font-medium"
                >
                  {genre.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GenreFilter;

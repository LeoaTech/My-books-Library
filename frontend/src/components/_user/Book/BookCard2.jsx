import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const BookCard2 = ({ id, img, title, price, discount, genres }) => {
  const [isHovered, setIsHovered] = useState(false);

  // rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar key={index} className="text-yellow-500 text-sm" />
  ));

  return (
    <div
      className="p-4 bg-white rounded transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="relative">
        {/* book img */}
        <div className="overflow-hidden">
          <img
            className="h-full w-full rounded object-cover transition-all duration-300 group-hover:scale-125"
            src={img}
            alt=""
          />
        </div>
        {/* sale */}
        <div className="absolute top-0 m-1 rounded-full bg-white">
          <p className="rounded-full bg-white p-1 text-[10px] font-extrabold uppercase tracking-wide text-purple-900 sm:py-1 sm:px-3">
            Sale
          </p>
        </div>
        {/* add to favorites */}
        <div className="absolute top-0 right-0 m-1 rounded bg-white p-2">
          <FaHeart className="text-black w-6 h-6" />
        </div>
        {/* content */}
        <div className="mt-4 flex flex-col items-center">
          {/* book title */}
          <h3 className="text-xs font-semibold sm:text-sm md:text-base">
            <a href="#" title="" className="">
              {title}
            </a>
          </h3>
          {/* genres */}
          <div className={`flex ${isHovered ? "hidden" : "block mb-2"}`}>
            <span key={id} className="text-purple-500 font-semibold">
              {genres}
            </span>
          </div>
          {/* rating & price and discount */}
          <div className="flex items-center w-full justify-around">
            <div className="flex items-center">{stars}</div>
            <div className="flex ml-2 gap-2">
              <p className="text-xs font-normal sm:text-sm md:text-base">
                {discount}
              </p>
              <del className="mt-px text-xs font-semibold text-gray-600 sm:text-sm">
                {price}
              </del>
            </div>
          </div>
        </div>
        {/* buy and borrow btns */}
        <div
          className={`w-full flex gap-2 mt-2 ${isHovered ? "block" : "hidden"}`}
        >
          <button
            type="button"
            className="w-1/2 bg-black text-white py-2 px-4 rounded"
          >
            Buy
          </button>
          <button
            type="button"
            className="w-1/2 bg-black text-white py-2 px-4 rounded"
          >
            Borrow
          </button>
        </div>
      </article>
    </div>
  );
};

export default BookCard2;

import React from "react";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const DetailedBookCard = ({
  id,
  img,
  title,
  author,
  description,
  price,
  discount,
  genres,
}) => {
  // rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar key={index} className="text-yellow-500 text-sm" />
  ));
  return (
    <div className="bg-white max-w-screen-lg rounded-md border border-gray-100 text-black shadow-md">
      <div className="relative flex h-full flex-col text-black md:flex-row">
        {/* book img */}
        <div className="overflow-hidden p-4">
          <img
            className="sm:h-56 md:60 lg:h-64 w-full rounded object-cover transition-all duration-300 group-hover:scale-125"
            src={img}
            alt={title}
          />
        </div>
        {/* content */}
        <div className="relative p-4 md:w-3/4">
          {/* title, genres, price and discount */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col md:flex-row">
              <h2 className="mb-2 text-2xl font-black">{title}</h2>
              <span className="ml-2 text-sm text-purple-500 font-semibold">
                {genres}
              </span>
            </div>
            <div className="flex">
              <p className="text-2xl font-black">
                {discount}
                <del className="align-super text-sm text-purple-500 font-semibold">
                  {" "}
                  {price}
                </del>
              </p>
              <span className="ml-2 text-white font-bold text-xs uppercase rounded p-2 bg-purple-400">
                258 Sold
              </span>
            </div>
          </div>
          {/* description and rating */}
          <div className="mt-2 flex space-x-8 items-center">
            <p className="font-sans text-justify tracking-normal">
              {description}
            </p>
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl font-black">5.0</span>
              <div className="flex items-center">{stars}</div>
              <span className="text-xs font-semibold">245 Reviews</span>
            </div>
          </div>
          {/* author, publisher, publish year */}
          <ul className="mt-4 text-purple-600 font-medium book-info list-none p-0 flex items-center gap-4">
            <li>
              <span className="text-black font-semibold">Written by: </span>
              {author}
            </li>
            <li>
              <span className="text-black font-semibold">Publisher: </span>
              Leoatech
            </li>
            <li>
              <span className="text-black font-semibold">Year: </span>
              2024
            </li>
          </ul>
          {/* add to favorites & buy and borrow buttons */}
          <div className="mt-4 flex flex-col sm:flex-row">
            <button className="mr-2 mb-4 flex cursor-pointer items-center justify-center rounded-md bg-emerald-400 py-2 px-8 text-center text-white transition duration-150 ease-in-out hover:translate-y-1 hover:bg-emerald-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Buy now
            </button>
            <button className="mr-2 mb-4 flex cursor-pointer items-center justify-center rounded-md border py-2 px-8 text-center transition duration-150 ease-in-out hover:translate-y-1 bg-blue-400 hover:bg-blue-500 text-white">
              Borrow
            </button>
            <button className="mr-2 mb-4 flex cursor-pointer items-center justify-center rounded-md border p-2 text-center transition duration-150 ease-in-out hover:translate-y-1 bg-rose-500 hover:bg-rose-600 text-white">
              <FaHeart className="text-white w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedBookCard;

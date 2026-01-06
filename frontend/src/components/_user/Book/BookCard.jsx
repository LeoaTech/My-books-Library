import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const BookCard = ({ id, img, title, purchase_price, member_price, discount_percentage, publisher, publish_year, isAvailable = true, hideWishlist = false }) => {
  // rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar key={index} className="text-yellow text-sm" />
  ));

  return (
    <div className="slide flex gap-4 mb-8">
      <article
        key={id}
        className="book bg-purple-300 rounded-lg p-4 text-center flex flex-col items-center"
        style={{ width: "200px" }}
      >
        <Link to="/book" className="relative w-full">
          {/* Badge: show only when sold out or when there's a discount */}
          {(!isAvailable || Number(discount_percentage) > 0) && (
            <div className="absolute top-0 m-1 rounded-full bg-white">
              <p
                className={`rounded-full bg-white p-1 text-[14px] font-bold tracking-wide sm:py-1 sm:px-3 ${isAvailable ? 'text-purple-900' : 'text-red-600'}`}
              >
                {!isAvailable ? 'Sold out' : 'Sale'}
              </p>
            </div>
          )}
          <img
            src={img}
            alt={title}
            className="w-full mx-auto mb-2 rounded-lg"
            style={{ height: "280px" }}
          />
          {!hideWishlist && (
            <span className="absolute top-0 right-0 m-2 p-2 rounded-full bg-white hover:bg-black hover:text-white text-2xl">
              <FaHeart className="stroke-red-500 stroke-2" />
            </span>
          )}
        </Link>
        <Link to="/book">
          <h1
            className="tracking-tight text-1xl font-bold"
            style={{ maxWidth: "16em" }}
          >
            {title}
          </h1>
        </Link>
        <div className="mt-2 mb-2 flex items-center justify-between gap-4">
          <p>
            <span className="text-lg font-bold text-slate-900">$449</span>
            <span className="text-sm text-slate-900 line-through"> $699</span>
          </p>
          <div className="flex items-center justify-center">
            {stars}
            {/* <span class="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">5.0</span> */}
          </div>
        </div>
        <div className={`flex gap-2 w-full ${isHovered ? 'block' : 'hidden'}`}>
          {!isAvailable ? (
            <button
              type="button"
              className={`w-full py-2 px-4 rounded bg-gray-400 text-gray-700 cursor-not-allowed text-center`}
              disabled
            >
              Sold out
            </button>
          ) : (
            <>
              <button
                type="button"
                className={`w-full py-2 px-4 rounded bg-black text-white`}
              >
                Buy
              </button>
              <button
                type="button"
                className={`w-full py-2 px-4 rounded bg-black text-white`}
              >
                Borrow
              </button>
            </>
          )}
        </div>
      </article>
    </div>
  );
};

export default BookCard;
BookCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  discount_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isAvailable: PropTypes.bool,
  hideWishlist: PropTypes.bool,
};

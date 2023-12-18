import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { FaStar } from 'react-icons/fa';

const BookOverview = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [detailsActive, setDetailsActive] = useState(true);
  const [reviewsActive, setReviewsActive] = useState(false);

  const handleDetailsActive = () => {
    setDetailsActive(true);
    setReviewsActive(false)
  }

  const handleReviewsActive = () => {
    setDetailsActive(false);
    setReviewsActive(true)
  }

  const book = {
    id: 1,
    isbn: 1234,
    format: 'Paperback, 450 Pages',
    genre: 'Fiction',
    img: 'https://m.media-amazon.com/images/I/81OrrjDgaSL._AC_UL480_FMwebp_QL65_.jpg',
    title: 'The Bookstore Sisters',
    author: 'Alice Hoffman',
    author_img: 'https://mczellbookwriting.com/blog/wp-content/uploads/2022/07/J.K.-Rowling.jpg',
    publisher: 'Leoatech',
    publish_year: '2023',
    pages: 520,
    discount: 15.22,
    price: 70.00,
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat. Duis aute irure dolor in reprehenderit.`,
    reviews: [
      {
        username: 'Michel Poe',
        date: 'December 28, 2022',
        rating: 4,
        comment: 'Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam vulputate'
      },
      {
        username: 'Celesto Anderson',
        date: 'December 28, 2022',
        rating: 5,
        comment: 'Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam vulputate'
      },
      {
        username: 'Ryan',
        date: 'December 28, 2022',
        rating: 3,
        comment: 'Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam vulputat'
      },
      {
        username: 'Stuart',
        date: 'December 28, 2022',
        rating: 4,
        comment: 'Donec suscipit porta lorem eget condimentum. Morbi vitae mauris in leo venenatis varius. Aliquam nunc enim, egestas ac dui in, aliquam vulputater'
      },
    ],
    tags: ['Drama', 'Advanture', 'Survival', 'Trending2023', 'Bestseller'],
  };

  // rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar key={index} className='text-yellow-500' />
  ));

  useEffect(() => {
    setTimeout(() => {
      setShowLoader(false);
    }, 2000);
  }, []);

  if (showLoader) return <Loader />;

  return (
    <section className="overflow-hidden text-gray-100">
      {book && (
        <div className="container px-5 pt-32 pb-4 mx-auto sm:py-24">
          <div className="flex flex-wrap items-center mx-auto lg:max-w-5xl mb-8">
            <img alt={book.title} className="object-cover object-center w-full rounded h-1/2 lg:w-1/4" src={book.img} />
            <div className="w-full mt-6 lg:w-2/3 lg:pl-10 lg:py-6 lg:mt-0">
              <h2 className="relative text-md font-semibold tracking-widest text-purple-900 title-font">
                {book.author}
                <div className="absolute right-0 sm:bottom-4 sm:relative bottom-24">
                  <button type="button" className="absolute right-0 w-12 h-12 text-pink-600 rounded-full top-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-3/4 p-2 bg-pink-200 rounded-full bg-opacity-60 h-3/4`} >
                      <path strokeLinecap="round" strokeLinejoin="round" d={`M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 
                      2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z`} />
                    </svg>
                  </button>
                </div>
              </h2>
              <h1 className="mb-1 text-3xl font-medium text-black title-font">{book.title}</h1>
              <div className='flex mb-2'>
                {stars}
                <h6 className="text-xs ml-2 font-semibold px-2.5 py-0.5 rounded bg-purple-900 bg-opacity-80 text-white">
                  {(book.reviews.reduce((acc, review) => acc + review.rating, 0) / book.reviews.length).toFixed(1)}
                </h6>
              </div>
              <div className="book-detail mb-4">
                <ul className="font-medium book-info list-none p-0 flex items-center gap-4">
                  <li><span className="text-black font-semibold">Genre: </span>{book.genre}</li>
                  <li><span className="text-black font-semibold">Publisher: </span>{book.publisher}</li>
                  <li><span className="text-black font-semibold">Year: </span>{book.publish_year}</li>
                </ul>
              </div>
              <p className="leading-relaxed">{book.description}</p>
              <div className="flex items-baseline my-4">
                <span className="text-2xl before:mr-1 before:content-['₹'] font-medium text-purple-900 title-font">
                  {book.price - book.discount}
                </span>
                <span className="text-md ml-2 before:mr-1 line-through before:content-['₹'] font-medium text-black title-font">
                  {book.price}
                </span>
                <div className="flex ml-auto gap-4">
                  <button className="w-20 bg-purple-900 rounded p-2">Borrow</button>
                  <button className="w-20 bg-purple-900 rounded p-2">Buy</button>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto text-purple-900 lg:max-w-5xl">
            <div className="border-b">
              <a onClick={handleDetailsActive}
                className={`text-black cursor-pointer font-extrabold ${detailsActive ? "border-b-4 border-red-500" : ""}`}>
                More Details
              </a>
              <a onClick={handleReviewsActive}
                className={`text-black cursor-pointer font-extrabold mx-8 ${reviewsActive ? "border-b-4 border-red-500" : ""}`}>
                Recent Reviews
              </a>
            </div>
            {detailsActive && (
              <div className="w-full sm:w-1/4 lg:w-1/2 flex justify-center flex-col content-center py-4 text-purple-900">
                <table class="border-separate border-2 border-purple-900">
                  <tbody>
                    <tr>
                      <td class="p-2 border border-purple-900 font-semibold">ISBN</td>
                      <td class="p-2 border border-purple-900">{book.isbn}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border border-purple-900 font-semibold">Edition Language</td>
                      <td class="p-2 border border-purple-900">English</td>
                    </tr>
                    <tr>
                      <td class="p-2 border border-purple-900 font-semibold">Book Format</td>
                      <td class="p-2 border border-purple-900">{book.format}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border border-purple-900 font-semibold">Pages</td>
                      <td class="p-2 border border-purple-900">{book.pages}</td>
                    </tr>
                    <tr>
                      <td class="p-2 border border-purple-900 font-semibold">Tags</td>
                      <td class="p-2 border border-purple-900 flex-wrap">
                        {book.tags.map((tag) => (
                          <span className='text-xs ml-2 font-semibold px-2.5 py-0.5 rounded bg-purple-900 bg-opacity-80 text-white'>{tag}</span>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {reviewsActive && book.reviews.length > 0 && book.reviews.map(({ username, date, rating, comment }, index) => (
              <div key={index} className="w-full lg:w-1/2 flex justify-center flex-col content-center py-4 border-b text-purple-900">
                <div className="grid grid-cols-4 grid-rows-1 gap-4">
                  <div className="flex flex-wrap items-center col-span-2">
                    <p className="w-40 truncate sm:w-60">{username}</p>
                    <div className="flex flex-col items-start justify-between w-full space-y-2 sm:flex-row">
                      <p className="text-xs text-black">{date} </p>
                      <span className="text-xs mr-3 font-semibold px-2.5 py-0.5 rounded bg-purple-900 bg-opacity-80 text-white">
                        {rating}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-md text-justify text-white">{comment}</p>
                  </div>
                </div>
              </div>)
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BookOverview;
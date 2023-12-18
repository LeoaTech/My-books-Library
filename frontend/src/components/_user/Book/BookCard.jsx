import React from 'react';
import { FaStar } from 'react-icons/fa';

const BookCard = ({ id, img, title, author }) => {
  // rating
  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar key={index} className='text-yellow-500' />
  ));

  return (
    <div className="slide flex gap-4 mb-8" style={{ width: '200px' }}>
      <article className='book bg-gray-100 rounded-lg p-8 text-center flex flex-col items-center' style={{ width: '200px' }}>
        <img src={img} alt={title} className='mx-auto mb-4 rounded-lg' style={{ height: '200px' }} />
        <h1 className='text-1xl font-bold mx-auto' style={{ maxWidth: '8em' }}>{title}</h1>
        <h4 className='text-md font-semibold mb-2 mx-auto'>{author}</h4>
        <div className='flex items-center justify-center mb-2'>{stars}</div>
        <button type='button' className='bg-blue-500 text-white py-2 px-4 rounded'>Borrow</button>
      </article>
    </div>
  );
};

export default BookCard;
import React from 'react'
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({book}) => {
    // rating
    const stars = Array.from({ length: 5 }, (_, index) => (
        <FaStar key={index} className='text-yellow-500' />
    ));
    return (
        <>
            {book.reviews.length > 0 && book.reviews.map(({ img, username, date, comment }, index) => (
                <ul key={index} className="mt-4">
                    <li className="py-4 text-left border px-4 m-2 rounded">
                        <div className="flex items-start">
                            <img className="block h-10 w-10 max-w-full flex-shrink-0 rounded-full align-middle" src={img} alt="" />
                            <div className="ml-6">
                                <div className="flex items-center">
                                    {stars}
                                </div>
                                <p className="mt-2 text-base text-gray-900">
                                    {comment}
                                </p>
                                <p className="mt-4 text-sm font-bold text-gray-900">{username}</p>
                                <p className="mt-1 text-sm text-gray-600">{date}</p>
                            </div>
                        </div>
                    </li>
                </ul>
            ))}
        </>
    )
}

export default ReviewCard
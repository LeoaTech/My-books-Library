import React from 'react';
import { Link } from "react-router-dom";
import { FaStar } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';

const RelatedBookCard = ({ book }) => {

    const books = [
        {
            id: 1,
            img: 'https://m.media-amazon.com/images/I/81OrrjDgaSL._AC_UL480_FMwebp_QL65_.jpg',
            title: '1 The Bookstore Sisters',
            author: 'Alice Hoffman'
        },
        {
            id: 2,
            img: 'https://m.media-amazon.com/images/I/71PNGYHykrL._AC_UL480_FMwebp_QL65_.jpg',
            title: '2 It Starts with Us',
            author: 'Colleen Hoover'
        },
        {
            id: 3,
            img: 'https://m.media-amazon.com/images/I/71PE4o0rSPL._AC_UL480_FMwebp_QL65_.jpg',
            title: '3 There is No Cloud',
            author: 'Kat Wheeler'
        },
    ]

    // rating
    const stars = Array.from({ length: 5 }, (_, index) => (
        <FaStar key={index} className='text-yellow text-sm' />
    ));
    
    return (
        // map related books
        <div className="flex flex-col gap-4 mt-4 ml-4">
            {books.map((book) => {
                    return (
                        <article key={book.id} className='w-3/4 bg-black rounded-lg p-4 text-center flex items-start gap-4'>
                            <Link to="/book">
                            <img src={book.img} alt={book.title} className='h-32 object-contain rounded-lg'/>
                            </Link>
                            <div className="flex flex-col items-start">
                                <Link to="/book">
                                    <h1 className='tracking-tight text-lg font-bold'>{book.title}</h1>
                                </Link>
                                <div className="mt-2 mb-2 flex gap-4 items-center">
                                    <p>
                                    <span className="text-lg font-bold text-slate-900">$449</span>
                                    <span className="text-sm text-slate-900 line-through"> $699</span>        
                                    </p>
                                    <div className="flex items-center"> 
                                    {stars}
                                    </div>
                                </div>
                                <div className="flex gap-4 text-black font-semibold">
                                    <button type='button' className='bg-white w-20 py-2 px-4 rounded'>Buy</button>
                                    <button type='button' className='bg-white w-20 py-2 px-4 rounded'>Borrow</button>
                                </div>
                            </div>
                        </article>
                    );
            })}
        </div>
    )
}

export default RelatedBookCard
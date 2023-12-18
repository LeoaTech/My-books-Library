import React, {useState} from 'react';
import BookCard from '../Book/BookCard';
import '../index.css';

function InfiniteSlider({books}) {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className={`booklist relative m-auto max-w-screen-xl mx-auto overflow-hidden before:absolute before:left-0 before:top-0 before:z-[2] before:h-full before:w-[100px] before:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] before:content-[''] after:absolute after:right-0 after:top-0 after:z-[2] after:h-full after:w-[100px] after:-scale-x-100 after:bg-[linear-gradient(to_right,white_0%,rgba(255,255,255,0)_100%)] after:content-['']`}>
            <div className={`${isHovered ? 'animate-none' : 'animate-infinite-slider'} flex w-[calc(250px*5)] gap-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            >
                {books.map((book) => {
                    return (
                        <BookCard key={book.id} {...book}></BookCard>
                    );
                })}
                {books.map((book) => {
                    return (
                        <BookCard key={book.id} {...book}></BookCard>
                    );
                })}  
            </div>
        </div>
    )
}

export default InfiniteSlider
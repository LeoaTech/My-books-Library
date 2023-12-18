import React from 'react';
import Slider from '../InfiniteSlider/InfiniteSlider';
import { books } from '../data';
import '../index.css';

const NewArrivalBooks = () => {

  return (
    <section className="new-arrivals-container">
        <div className="section-head text-center">
          <h1 className="heading title inline-block border-b-2 border-white font-extrabold">
            New Arrivals
          </h1>
          <p className="sub-heading my-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quiss
          </p>
        </div>
        <Slider books={books} />
    </section>
  );
};

export default NewArrivalBooks;

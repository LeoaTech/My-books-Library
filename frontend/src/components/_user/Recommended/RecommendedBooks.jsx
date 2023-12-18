import React from 'react';
import Slider from '../InfiniteSlider/InfiniteSlider';
import { books } from '../data';
import '../index.css';

const RecommendedBooks = () => {

  return (
    <section className="recommend-container">
        <div className="section-head text-center">
          <h1 className="heading title inline-block border-b-2 border-white font-extrabold">
            Recommended For You
          </h1>
          <p className="sub-heading my-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quiss
          </p>
        </div>
        <Slider books = {books} />
    </section>
  );
};

export default RecommendedBooks;

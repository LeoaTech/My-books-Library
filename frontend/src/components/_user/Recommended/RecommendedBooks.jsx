import React from "react";
import Slider from "../InfiniteSlider/InfiniteSlider";
import { books } from "../data";
import "../index.css";

const RecommendedBooks = () => {
  return (
    <section className="recommend-container">
      <div className="section-head text-center">
        <h2 className="mt-10 mb-3 text-center text-2xl font-bold uppercase">
          Recommended For You
        </h2>
        <hr className="mx-auto mb-10 h-2 w-20 transform border-y-2 border-y-blue-500" />
      </div>
      <Slider books={books} />
    </section>
  );
};

export default RecommendedBooks;

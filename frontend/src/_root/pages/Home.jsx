import React from "react";
import Navbar from "../../components/_user/Navbar/Navbar";
import HeroSection from "../../components/_user/HeroSection/HeroSection";
import RecommendedBooks from "../../components/_user/Recommended/RecommendedBooks";
import NewArrivalBooks from "../../components/_user/NewArrival/NewArrivalBooks";
import Genres from "../../components/_user/Categories/Genres";
import Stats from "../../components/_user/Stats/Stats";
import Footer from "../../components/_user/Footer/Footer";

const Home = () => {
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Sci-Fi",
    "Thriller",
    "Western",
    "Romance",
    "Crime",
    "Bioraphy",
    "Business",
    "Humor",
    "Gardening",
    "Health",
  ];

  return (
    <>
      <Navbar />
      <HeroSection />
      <RecommendedBooks />
      <NewArrivalBooks />
      <Genres genres={genres} />
      <Stats />
      <Footer />
    </>
  );
};

export default Home;

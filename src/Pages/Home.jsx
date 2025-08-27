import React from 'react';
import Hero from "../Components/Hero";
import Posts from "../Components/Posts";
import Categories from "../Components/Categories";

const Home = () => {
  return (
    <div>
      <Hero />
      <Posts />
      <Categories />
    </div>
  );
};

export default Home;
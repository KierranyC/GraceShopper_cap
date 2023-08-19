import React from "react";
import Featured from "./Featured";
import Products from "./AllProducts";

// This component acts as the main route of our e-commerce application. It should display a list of featured products followed by all of the products.
const Home = () => {
  return (
    <div className="home">
      <h1>Hello World!</h1>
      <Featured />
      <Products />
    </div>
  );
};

export default Home;

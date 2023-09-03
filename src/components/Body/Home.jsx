import React, { useState, useEffect } from "react";
import { Featured } from "./Featured.jsx";
import { Products } from "./AllProducts.jsx";
import { getProductsByCategoryAndSearch } from "../../api";

// This component acts as the main route of our e-commerce application. It should display a list of featured products followed by all of the products.
export const Home = ({ cart, setCart, token }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);

  // const handleSearch = async (category, search) => {
  //   try {
  //     const filteredProducts = await getProductsByCategoryAndSearch({
  //       category,
  //       search,
  //     });
  //     setFilteredProducts(filteredProducts);
  //   } catch (error) {
  //     console.error("Error fetching filtered products:", error);
  //   }
  // };

  return (
    <div className="home">
      <Featured />
      <Products filteredProducts={filteredProducts} cart={cart} setCart={setCart} token={token} />
    </div>
  );
};

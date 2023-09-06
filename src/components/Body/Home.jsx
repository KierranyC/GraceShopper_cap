import React, { useState, useEffect } from "react";
import { Featured } from "./Featured.jsx";
import { Products } from "./AllProducts.jsx";
import { fetchFeaturedProducts } from "../../apiCalls/index.js";

// This component acts as the main route of our e-commerce application. It should display a list of featured products followed by all of the products.
export const Home = ({
  productId,
  setProductId,
  cart,
  setCart,
  token,
  guestCart,
  setGuestCart,
  storedGuestSessionId,
  isLoggedIn,
}) => {
  // UseStates for Home
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await fetchFeaturedProducts();
        setFeaturedProducts(data);
        console.log(featuredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    }

    fetchFeatured();
  }, []);

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
      <Featured featuredProducts={featuredProducts} />
      <Products
        filteredProducts={filteredProducts}
        productId={productId}
        setProductId={setProductId}
        cart={cart}
        setCart={setCart}
        token={token}
        guestCart={guestCart}
        setGuestCart={setGuestCart}
        storedGuestSessionId={storedGuestSessionId}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

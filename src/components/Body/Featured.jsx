import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap/esm";
import { Link } from "react-router-dom";

// This component is a slideshow of featured products. This could be directly tied to sales, ratings, customer view history, or even manually added to an arrary of featured products by an admin. Have not decided best approach yet.
export const Featured = ({ featuredProducts }) => {
  return (
    <div className="text-center">
      <h2>Featured Products</h2>
      {featuredProducts.length > 0 ? (
        <Carousel>
          {featuredProducts.map((product) => (
            <Carousel.Item key={product.id}>
              <Link
                to={`/Product/${product.id}`}
                className="text-decoration-none"
              >
                <img
                  src={product.photo}
                  alt={product.title}
                  className="d-block w-100"
                />
                <Carousel.Caption>
                  <h3>{product.title}</h3>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No featured products available.</p>
      )}
    </div>
  );
};

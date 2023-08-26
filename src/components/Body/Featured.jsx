import React, { useState } from "react";
import { Carousel } from "react-bootstrap/esm";

// This component is a slideshow of featured products. This could be directly tied to sales, ratings, customer view history, or even manually added to an arrary of featured products by an admin. Have not decided best approach yet.
export const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  return (
    <div className="text-center">
      <h2>Featured Products</h2>
      {featuredProducts.length > 0 ? (
        <Carousel>
          {featuredProducts.map((product) => (
            <Carousel.Item key={product.id}>
              <Card>
                <Card.Img variant="top" src={product.photo} />
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <Button variant="primary">Add to Cart</Button>
                  <Button variant="secondary">Add to Wishlist</Button>
                </Card.Body>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <p>No featured products available.</p>
      )}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { ButtonGroup, Card } from "react-bootstrap/esm";
import { Reviews } from "./Reviews.jsx";
import { Featured } from "./Featured.jsx";
import { fetchProduct } from "../../apiCalls/index.js";
import { Button } from "react-bootstrap";

// This component renders a single Product based on its ID. It should also display the corresponding reviews with that product, as well as render the products information
export const Product = ({ productId }) => {
  // UseStates for Product
  const [product, setProduct] = useState({});

  // Gets a product everytime productId is updated
  useEffect(() => {
    async function getProduct() {
      try {
        console.log(productId);
        const data = await fetchProduct(productId);
        console.log(data);

        if (data && typeof data === "object") {
          setProduct(data);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    getProduct();
  }, [productId]);

  return (
    <div className="product-page m-3">
      <h2 className="text-center">{product.title}</h2>
      <div className="single-product m-3">
        <img src={product.photo} className="product-image" />
        <Card className="product-information">
          <Card.Text>Price: {product.price}</Card.Text>
          <Card.Text>
            {product.quantity ? <p>In Stock</p> : <p>Out of Stock</p>}
          </Card.Text>
          <Card.Text>Category: {product.category}</Card.Text>
          <Card.Text>{product.description}</Card.Text>
          <ButtonGroup>
            <Button className="">Add to Cart</Button>
            <Button>Add to Wishlist</Button>
          </ButtonGroup>
        </Card>
      </div>
      <Featured />
      <Reviews />
    </div>
  );
};

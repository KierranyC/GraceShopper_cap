import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap/esm";
import { Reviews } from "./Reviews.jsx";
import { Featured } from "./Featured.jsx";
import { fetchProduct } from "../../api/index.js";

// This component renders a single Product based on its ID. It should also display the corresponding reviews with that product, as well as render the products information
export const Product = ({ productId }) => {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    async function getProduct() {
      try {
        const data = await fetchProduct(productId);

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
    <div>
      <Card>
        <Card.Title>{product.title}</Card.Title>
        {/* <Card.Subtitle>Rating</Card.Subtitle> */}
        <Card.Img src="../../images/img-not-found.png" style={{width: 30 + "rem"}}></Card.Img>
        <Card.Text>{product.price}</Card.Text>
        <Card.Text>{product.quantity}</Card.Text>
        <Card.Text>{product.category}</Card.Text>
        <Card.Text>{product.description}</Card.Text>
      </Card>
      <Featured />
      <Reviews />
    </div>
  );
};

import React from "react";
import { Card } from "react-bootstrap/esm";
import Reviews from "./Reviews";
import Featured from "./Featured";

// This component renders a single Product based on its ID. It should also display the corresponding reviews with that product, as well as render the products information
const Product = () => {
  return (
    <div>
      <Card>
        <Card.Title>Product Name</Card.Title>
        <Card.Subtitle>Rating</Card.Subtitle>
        <Card.Img>Product Image</Card.Img>
        <Card.Text>Product Price</Card.Text>
        <Card.Text>Product Description</Card.Text>
      </Card>
      <Featured />
      <Reviews />
    </div>
  );
};

export default Product;

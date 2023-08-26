import React from "react";
import { Card } from "react-bootstrap/esm";
import { Reviews } from "./Reviews.jsx";
import { Featured } from "./Featured.jsx";

// This component renders a single Product based on its ID. It should also display the corresponding reviews with that product, as well as render the products information
export const Product = () => {
  return (
    <div>
      <Card>
        <Card.Img>Product Image</Card.Img>
        <Card.Title>Product Name</Card.Title>
        <Card.Subtitle>Rating</Card.Subtitle>
        <Card.Text>Product Price</Card.Text>
        <Card.Text>Product Description</Card.Text>
      </Card>
      <Featured />
      <Reviews />
    </div>
  );
};

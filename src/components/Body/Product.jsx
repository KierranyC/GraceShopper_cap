import React from "react";
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
        if (Array.isArray(data)) {
          setProduct(data);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProduct();
  }, []);

  return (
    <div>
      <Card>
        <Card.Title>{product.title}</Card.Title>
        {/* <Card.Subtitle>Rating</Card.Subtitle> */}
        <Card.Img>Product Image</Card.Img>
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

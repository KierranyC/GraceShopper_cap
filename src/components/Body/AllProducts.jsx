import React from "react";
import { Button, Card, Form } from "react-bootstrap";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
const Products = () => {
  return (
    <div>
      <h1 className="text-center">Products</h1>
      <div className="products">
        {/* {products.map((product) => (
          <Card key={product._id} className="mb-3">
            <Card.Body>
              <Card.Img>{product.photo}</Card.Img>
              <Card.Title>{product.title}</Card.Title>
              <Card.Subtitle>{product.price}</Card.Subtitle>
              <Form>
                <Form.Group>
                  <Button>-</Button>
                  <Form.Control type="text"></Form.Control>
                  <Button>+</Button>
                </Form.Group>
                <Button>Add to Cart</Button>
                <Button>Add to Wishlist</Button>
              </Form>
            </Card.Body>
          </Card>
        ))} */}
      </div>
    </div>
  );
};

export default Products;

import React from "react";
import { Button, Card, Form } from "react-bootstrap";

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

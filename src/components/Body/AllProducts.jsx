import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { fetchAllProducts } from "../../api";

const Products = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const data = await fetchAllProducts()
      console.log(data)
      setAllProducts(data)
    }
    getProducts()
  }, [])

  return (
    <div>
      <h1 className="text-center">Products</h1>
      <div className="products">
        {allProducts.map(product => (
          <Card key={product.id} value={product} className="mb-3">
            <Card.Body>
              {/* <Card.Img>{product.photo}</Card.Img> */}
              <Card.Title>{product.title}</Card.Title>
              <Card.Subtitle>{product.price}</Card.Subtitle>
              <Form>
                <Form.Group>
                  <Button>-</Button>
                  {/* <Form.Control type="text"></Form.Control> */}
                  <Button>+</Button>
                </Form.Group>
                <Button>Add to Cart</Button>
                <Button>Add to Wishlist</Button>
              </Form>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;

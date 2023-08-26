import React, { useState, useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { fetchAllProducts } from "../../api";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ setId, loggedIn }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts(setProducts);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const filterProducts = () => {
    const lowerCaseQuery = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredProducts(filtered);
  };

  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  return (
    <div className="container-fluid">
      <h1 className="text-center">Products</h1>
      <div className="products-grid">
        {productsToDisplay.map((product) => (
          <Card key={product.id} value={product} className="product-card mb-3">
            <Card.Body>
              {/*<Card.Img>{product.photo}</Card.Img>*/}
              <Card.Title>{product.title}</Card.Title>
              <Card.Subtitle>{product.price}</Card.Subtitle>
              <Form>
                <Form.Group>
                  <Button>-</Button>
                  <Form.Control type="number"></Form.Control>
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

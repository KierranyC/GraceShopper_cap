import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../../api";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ setProductId, productId, loggedIn }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  useEffect(() => {
    filter();
  }, [searchTerm]);

  const handleClick = (productId) => {
    setProductId(productId);
    console.log(productId);
    navigate(`/products/${productId}`);
  };

  const filter = () => {
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
      <Row className="products">
        {productsToDisplay.map((product) => (
          <Col key={product.id} md={4} className="product-card mb-3">
            <Link to={`/products/${product.id}`}>
              <Card.Body>
                <Card.Img variant="top" src="/images/img-not-found.png" />
                <Card.Title>{product.title}</Card.Title>
                <Card.Subtitle>{product.price}</Card.Subtitle>
                <Button onClick={() => handleClick(product.id)}>
                  Add to Cart
                </Button>
                <Button>Add to Wishlist</Button>
              </Card.Body>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { removeItemFromCart, fetchAllProducts, addItemToCart, fetchUserCart, createUserCart, updateCartItem } from "../../apiCalls";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ setProductId, productId, loggedIn }) => {
  // UseStates for Products
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Gets all products once at the startup of this component
  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  // Filters products depending on the searchTerm
  useEffect(() => {
    filter();
  }, [searchTerm]);

  // When clicking a product, sets the productId to the ID of the product clicked and logs that ID
  const handleClick = (productId) => {
    setProductId(productId);
    console.log(productId);
  };

  // A function for filtering based on a string search. Converts the search to lowercase and filters products for matching titles or descriptions in products
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

  // A variable for updating the products displayed on screen. If there is no searchTerm, shows all products
  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  return (
    <div className="container-fluid">
      <h1 className="text-center">Products</h1>
      <Row className="products ">
        {products.map((product) => (
          <Col
            key={product.id}
            value={product}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <Card.Body className="product-card">
              <Card.Img
                className="product-image"
                variant="top"
                src="/images/img-not-found.png"
              />
              <Link
                className="text-decoration-none"
                to={`/Product/${product.id}`}
                onClick={() => handleClick(product.id)}
              >
                <Card.Title>{product.title}</Card.Title>
              </Link>
              <Card.Subtitle>${product.price}</Card.Subtitle>
              <Button>Add to Cart</Button>
              <Button>Add to Wishlist</Button>
            </Card.Body >
          </Col >
        ))}
      </Row >
    </div >
  );
};

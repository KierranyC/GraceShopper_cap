import React, { useState, useEffect } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Products } from "../Body/AllProducts";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../../api";

// This component acts as a subnav for the AllProducts page. It should display a list of clickable cateogries to filter the products displayed.
export const Categories = () => {
  const [products, setProducts] = useState([]);
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

  return (
    <Navbar variant="dark" bg="dark" className="navbar-expand-xxl">
      <Nav variant="pills" className="flex-row">
        <Nav.Item className="me-2">
          <Link to="/">All Products</Link>
        </Nav.Item>
        {products.map((product) => (
          <Nav.Item key={product.id} className="me-2">
            <Link to={`/products/${product.category}`}>{product.category}</Link>
          </Nav.Item>
        ))}
      </Nav>
    </Navbar>
  );
};

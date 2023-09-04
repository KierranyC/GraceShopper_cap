import React, { useState, useEffect } from "react";
import { Button, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../../api";

// This component acts as a subnav for the AllProducts page. It should display a list of clickable cateogries to filter the products displayed.
export const Categories = ({ category, setCategory }) => {
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

  useEffect(() => {
    console.log("category:", category);
  }, [category]);

  const uniqueCategories = new Set(products.map((product) => product.category));

  console.log("uniqueCategories", uniqueCategories);

  const handleClick = (cat) => {
    setCategory(cat);
  };

  return (
    <Navbar variant="dark" bg="dark" className="navbar-expand-xxl">
      <Nav className="flex-row">
        <NavDropdown>
          <NavDropdown.Item></NavDropdown.Item>
        </NavDropdown>
        <Nav.Item className="me-2">
          <Link to="/">All Products</Link>
        </Nav.Item>
        {[...uniqueCategories].map((category) => (
          <Nav.Item key={category} className="me-2">
            <Link to={`/Products/${category}`} onClick={()=>handleClick(category)}>
              {category}
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </Navbar>
  );
};

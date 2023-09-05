import React, { useState, useEffect } from "react";
import { Button, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { fetchAllProducts } from "../../apiCalls";

// This component acts as a subnav for the AllProducts page. It should display a list of clickable cateogries to filter the products displayed.
export const Categories = ({ category, setCategory }) => {
  // UseStates for Categories
  const [products, setProducts] = useState([]);

  // Gets all products once on start up
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

  // Logs the category selected everytime category changes
  // useEffect(() => {
  //   console.log("category:", category);
  //   localStorage.setItem("selectedCategory", category);
  // }, [category]);

  // Sets a list of unique category names to avoid repeat categories when rendering
  const uniqueCategories = new Set(products.map((product) => product.category));

  // console.log("uniqueCategories", uniqueCategories);

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      setCategory(storedCategory);
    }
  }, []);

  // Sets the category to the category selected
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
            <Link
              to={`/Products/${category}`}
              onClick={() => handleClick(category)}
            >
              {category}
            </Link>
          </Nav.Item>
        ))}
      </Nav>
    </Navbar>
  );
};

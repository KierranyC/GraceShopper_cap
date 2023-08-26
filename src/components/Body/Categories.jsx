import React from "react";
import { Navbar } from "react-bootstrap";

// This component acts as a subnav for the AllProducts page. It should display a list of clickable cateogries to filter the products displayed.
export const Categories = () => {
  return (
    <div>
      <Navbar>
        <Navbar.Brand>Categories</Navbar.Brand>
      </Navbar>
    </div>
  );
};

import React from "react";
import { Nav, Navbar } from "react-bootstrap";

// This component acts as a subnav for the AllProducts page. It should display a list of clickable cateogries to filter the products displayed.
export const Categories = () => {
  return (
    <Navbar variant="dark" bg="dark">
      <Nav variant="pills" className="flex-row">
        <Nav.Item>
          <Nav.Link>All Categories</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>Category 1</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>Category 2</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>Category 3</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link>And So on</Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

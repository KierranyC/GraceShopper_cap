import React from "react";
import Search from "./Search";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";

const Header = () => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Navbar className="navbar-expand-lg navbar-dark bg-dark">
      <Navbar.Brand href="/" className="d-none d-md-block">
        Company Name
      </Navbar.Brand>
      <Search />
      <Nav>
        <NavDropdown title="Account Name" id="basic-nav-dropdown">
          <NavDropdown.Item href="/account">Account</NavDropdown.Item>
          <NavDropdown.Item href="/wishlist">Wishlist</NavDropdown.Item>
          <NavDropdown.Item href="/cart">Cart</NavDropdown.Item>
          <NavDropdown.Item href="/orders">Orders</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/" onClick={handleLogout}>
            Logout
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar>
  );
};

export default Header;

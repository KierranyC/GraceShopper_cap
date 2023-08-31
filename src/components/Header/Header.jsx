import React, { useState, useEffect } from "react";
import { Search } from "./Search.jsx";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Categories } from "./Categories.jsx";

// This component will be displayed across the top of all routes on the application. This should have the company name, a search bar to search for products, as well as some links to different routes. For logged in users, links to Login and Signup should be replaced by Logout, and Admins should have a link to their dashboard for ease of access.
export const Header = ({ token, setToken, username }) => {
  const [newUser, setNewUser] = useState(true);
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    setIsLoggedIn(false);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setNewUser(true);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    navigate("/Login");
  };

  const handleRegister = (event) => {
    event.preventDefault();
    navigate("/Register");
  };

  const checkToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setNewUser(false);
    } else {
      setNewUser(true);
    }
  };

  const handleSetIsListening = (isListening) => {
    setIsListening(isListening);
  };

  useEffect(() => {
    checkToken();
  }, [token]);

  return (
    <Navbar className="navbar-expand-lg navbar-dark bg-dark">
      <Navbar.Brand href="/" className="company-name d-none d-md-block">
        Oilay
      </Navbar.Brand>
      <Categories />
      {/* <Search /> */}
      {newUser === false && (
        <Nav>
          <NavDropdown title={username} id="basic-nav-dropdown">
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
      )}
      {newUser === true && (
        <Nav>
          <NavDropdown title="Sign Up Here!" id="basic-nav-dropdown">
            <NavDropdown.Item href="/" onClick={handleLogin}>
              Login
            </NavDropdown.Item>
            <NavDropdown.Item href="/" onClick={handleRegister}>
              Register
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      )}
    </Navbar>
  );
};

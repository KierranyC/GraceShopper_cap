import React, { useState, useEffect } from "react";
import { Search } from "./Search.jsx";
import {
  Nav,
  NavDropdown,
  Navbar,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Categories } from "./Categories.jsx";

// This component will be displayed across the top of all routes on the application. This should have the company name, a search bar to search for products, as well as some links to different routes. For logged in users, links to Login and Signup should be replaced by Logout, and Admins should have a link to their dashboard for ease of access.
export const Header = ({ token, setToken, username }) => {
  const [newUser, setNewUser] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  // const handleSetIsListening = (isListening) => {
  //   setIsListening(isListening);
  // };

  useEffect(() => {
    checkToken();
  }, [token]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/" className="company-name d-none d-md-block">
        Oilay
      </Navbar.Brand>

      <Form inline="true" className="search-bar-container">
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-info">Search</Button>
      </Form>

      <Navbar.Toggle aria-controls="basic-navbar-nav">
        {newUser === false && (
          <div className="d-flex align-items-center">
            <span className="mr-2">{username}</span>
            <FontAwesomeIcon icon={faUser} size="lg" />
          </div>
        )}
        {newUser === true && (
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faUser} size="lg" />
            <Button variant="outline-light" onClick={handleRegister}>
              Sign Up
            </Button>
          </div>
        )}
      </Navbar.Toggle>

      <Navbar.Collapse id="basic-navbar-nav" className="ml-auto">
        <Nav className="ml-auto">
          {newUser === false && (
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
          )}
          {newUser === true && (
            <Nav className="ml-auto">
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
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

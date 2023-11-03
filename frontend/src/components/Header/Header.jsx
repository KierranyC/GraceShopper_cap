import React, { useState, useEffect } from "react";
// An attempt to add Search functionality
// import { Search } from "./Search.jsx";
import { Nav, NavDropdown, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Categories } from "./Categories.jsx";

// This component will be displayed across the top of all routes on the application. This should have the company name, a search bar to search for products, as well as some links to different routes. For logged in users, links to Login and Signup should be replaced by Logout, and Admins should have a link to their dashboard for ease of access.
export const Header = ({
  isAdmin,
  token,
  setToken,
  username,
  setIsLoggedIn,
  category,
  setCategory,
  setIsAdmin,
  setUsername,
  setProductQuantities,
  productQuantities,
  setUserId
}) => {
  // UseStates for Header
  const [newUser, setNewUser] = useState(true);
  const navigate = useNavigate();
  console.log('IS ADMIN CHECK HEADER:', isAdmin)

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setNewUser(false);
    } else {
      setNewUser(true);
    }
  }, [token]);

  // A function for logging out a user
  const handleLogout = (event) => {
    event.preventDefault();
    setIsLoggedIn(false);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    setIsAdmin(false)
    localStorage.removeItem("username");
    setNewUser(true);
    setUsername('')
    setUserId('')
    setProductQuantities({})
    localStorage.setItem(
      "productQuantities",
      JSON.stringify({})
    );
    navigate('/login')
  };

  // A function that directs a user to the Login route
  const handleLogin = (event) => {
    event.preventDefault();
    navigate("/Login");
  };

  // A function that directs a user to the Account route
  const handleAccount = (event) => {
    event.preventDefault();
    navigate("/Account");
  };

  // A function that directs a user to the Wishlist route
  const handleWishList = (event) => {
    event.preventDefault();
    navigate("/Wishlist");
  };

  // A function that directs a user to the Cart route
  const handleCart = (event) => {
    event.preventDefault();
    navigate("/Cart");
  };

  // A function that directs a user to the Orders route
  const handleOrders = (event) => {
    event.preventDefault();
    navigate("/Orders");
  };

  // A function that directs a user to the Register route
  const handleRegister = (event) => {
    event.preventDefault();
    navigate("/Register");
  };

  const handleAdmin = (event) => {
    event.preventDefault()
    navigate('/AdminDashboard')
  }

  // A function that checks for an existing token in local storage. If one does not exists, displays pages for a new user
  const checkToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setNewUser(false);
    } else {
      setNewUser(true);
    }
  };

  // A function that directs a user to a search route
  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  // A function for voice search implementation
  // const handleSetIsListening = (isListening) => {
  //   setIsListening(isListening);
  // };

  // Checks for a token everytime token is updated
  useEffect(() => {
    checkToken();
  }, [token]);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand as={Link} to="/" className="company-name">
        Oilay
      </Navbar.Brand>
      <div className="d-flex align-items-center justify-content-center">
        <Categories category={category} setCategory={setCategory} />
        {/* <Search /> */}
      </div>
      <Navbar.Brand onClick={handleCart}>Cart</Navbar.Brand>
      {!newUser && isAdmin ? (
        <Nav>

          <NavDropdown title={username} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={handleAccount}>Account</NavDropdown.Item>
            {/* <NavDropdown.Item onClick={handleWishList}>
              Wishlist
            </NavDropdown.Item> */}
            {/* <NavDropdown.Item onClick={handleOrders}>Orders</NavDropdown.Item> */}
            <NavDropdown.Item onClick={handleAdmin}>AdminDash</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="/" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      ) : !newUser && (
        <Nav>
          <NavDropdown title={username} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={handleAccount}>Account</NavDropdown.Item>
            {/* <NavDropdown.Item onClick={handleWishList}>
              Wishlist
            </NavDropdown.Item> */}

            {/* <NavDropdown.Item onClick={handleOrders}>Orders</NavDropdown.Item> */}
            <NavDropdown.Divider />
            <NavDropdown.Item href="/" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      )}
      {newUser === true && (
        <Nav className="ms-auto">
          <NavDropdown
            align="flex-end"
            title="Sign Up Here!"
            id="basic-nav-dropdown"
            className="account-dropdown dropdown-menu-end"
          >
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

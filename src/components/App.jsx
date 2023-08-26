import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header/Header";
import Home from "./Body/Home";
import Contacts from "./Body/Contacts";
import Product from "./Body/Product";
import Cart from "./Header/Cart";
import Account from "./Header/Account";
import Wishlist from "./Header/Wishlist";
import Orders from "./Header/Orders";
import Register from "./Header/Register";
import Login from "./Header/Login";
import { AccountForm } from "./Forms/AccountForm";
// Ignore the endless amount of imports, I will clean that up after I reexport files from the components index.js

// This is the Mother of all components. This is what will house all of the other components to render on screen.
const App = () => {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const setAndStoreToken = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const setAndStoreUsername = (username) => {
    localStorage.setItem("username", username);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter className="app-container">
      <Header token={token} setToken={setToken} username={username} />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>

        <Route exact path="/product/:productId" element={<Product />}></Route>

        <Route exact path="/cart" element={<Cart />}></Route>

        <Route exact path="/orders" element={<Orders />}></Route>

        <Route
          exact
          path="/account"
          element={
            <Account
              setUsername={setUsername}
              username={username}
              token={token}
            />
          }
        ></Route>

        <Route exact path="/wishlist" element={<Wishlist />}></Route>

        <Route
          exact
          path="/User/Edit"
          setUsername={setUsername}
          username={username}
          token={token}
          setAndStoreUsername={setAndStoreUsername}
          element={<AccountForm />}
        ></Route>

        <Route
          exact
          path="/Register"
          element={
            <Register
              token={token}
              setToken={setAndStoreToken}
              username={username}
              setUsername={setUsername}
              setAndStoreUsername={setAndStoreUsername}
            />
          }
        ></Route>

        <Route
          exact
          path="/Login"
          element={
            <Login
              token={token}
              setToken={setAndStoreToken}
              username={username}
              setUsername={setUsername}
              setAndStoreUsername={setAndStoreUsername}
            />
          }
        ></Route>
      </Routes>
      <footer>
        <p>This is the footer!</p>
        <Contacts />
      </footer>
    </BrowserRouter>
  );
};

export default App;

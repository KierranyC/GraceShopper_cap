import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";
import CartProvider from "../CartContext";

import {
  Header,
  Home,
  Contacts,
  Product,
  Cart,
  Account,
  Wishlist,
  Orders,
  Register,
  Login,
  Search,
  Categories,
  AccountForm,
} from "../components/index";

// This is the Mother of all components. This is what will house all of the other components to render on screen.
export const App = () => {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
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
    <CartProvider>
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
                id={id}
                setId={setId}
              />
            }
          ></Route>

          <Route exact path="/wishlist" element={<Wishlist />}></Route>

          <Route
            exact
            path="/User/Edit"
            element={
              <AccountForm
                setUsername={setUsername}
                username={username}
                token={token}
                setAndStoreUsername={setAndStoreUsername}
                id={id}
                setId={setId}
              />
            }
          ></Route>

          <Route
            exact
            path="/User/Edit"
            element={
              <AccountForm
                setUsername={setUsername}
                username={username}
                token={token}
                setAndStoreUsername={setAndStoreUsername}
              />
            }
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
            path="/login"
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
        <footer className="footer">
          <Contacts />
        </footer>
      </BrowserRouter>
    </CartProvider>
  );
};

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";

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
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <BrowserRouter className="app-container">
      <Header token={token} setToken={setToken} username={username} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          exact
          path="/"
          element={<Home productId={productId} setProductId={setProductId} />}
        ></Route>

        <Route
          exact
          path={`/Products/:productId`}
          element={
            <Product productId={productId} setProductId={setProductId} />
          }
        ></Route>

        <Route exact path="/Cart" element={<Cart />}></Route>

        <Route exact path="/Orders" element={<Orders />}></Route>

        <Route
          exact
          path="/Account"
          element={
            <Account
              setUsername={setUsername}
              username={username}
              token={token}
              userId={userId}
              setUserId={setUserId}
            />
          }
        ></Route>

        <Route exact path="/Wishlist" element={<Wishlist />}></Route>

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
      <footer className="footer">
        <Contacts />
      </footer>
    </BrowserRouter>
  );
};

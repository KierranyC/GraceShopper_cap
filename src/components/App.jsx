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
  AccountForm,
  Category,
  Sidebar,
} from "../components/index";

// This is the Mother of all components. This is what will house all of the other components to render on screen.
export const App = () => {
  const categories = [
    { id: 1, name: "Shampoo" },
    { id: 2, name: "Conditioner" },
    { id: 3, name: "Repairing" },
    { id: 4, name: "Styling" },
    { id: 5, name: "Color & Dye" },
    { id: 6, name: "Specialty" },
  ];

  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

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
      <Header
        token={token}
        setToken={setToken}
        username={username}
        setIsLoggedIn={setIsLoggedIn}
        category={category}
        setCategory={setCategory}
      />
      <Routes>
        <Route
          path="/"
          element={
            <div className="home-container">
              <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategory}
              />
              <Home
                selectedCategory={selectedCategory}
                searchTerm={searchTerm}
                categories={categories}
                productId={productId}
                setProductId={setProductId}
              />
            </div>
          }
        ></Route>

        <Route
          path={`/Product/:productId`}
          element={
            <Product productId={productId} setProductId={setProductId} />
          }
        ></Route>

        <Route path="/Cart" element={<Cart />}></Route>

        <Route path="/Orders" element={<Orders />}></Route>

        <Route
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

        <Route path="/Wishlist" element={<Wishlist />}></Route>

        <Route
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

        <Route
          path={`/Products/:category`}
          element={<Category setCategory={setCategory} category={category} />}
        ></Route>
      </Routes>
      <footer className="footer">
        <Contacts />
      </footer>
    </BrowserRouter>
  );
};

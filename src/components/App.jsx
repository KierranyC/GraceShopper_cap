import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Adds styling to the App and its components
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";
import { CartProvider } from "../CartContext";

// Imports all components from their re-export in components/index.js
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
  // Sidebar,
} from "../components/index";

import { fetchUserCart } from "../api";
import { v4 as uuidv4 } from "uuid";
// This is the Mother of all components. This is what will house all of the other components to render on screen.
export const App = () => {
  // const categories = [
  //   { id: 1, name: "Shampoo" },
  //   { id: 2, name: "Conditioner" },
  //   { id: 3, name: "Repairing" },
  //   { id: 4, name: "Styling" },
  //   { id: 5, name: "Color & Dye" },
  //   { id: 6, name: "Specialty" },
  // ];

  // UseStates that are utilized by multiple components
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  // Stores a token and username locally and sets a user to Logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedGuestSessionId = localStorage.getItem("guestSessionId");
    // console.log('APP COMP STORED TOKEN:', storedToken)
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchUserCart(storedToken)
        .then((cartData) => {
          setCart(cartData);
        })
        .catch((error) => {
          console.error("Error fetching user cart:", error);
        });
    } else {
      if (!token && !storedGuestSessionId) {
        createNewGuest()
          .then((newGuest) => {
            // console.log('NEW GUEST RETURNED FROM BACKEND:', newGuest);
            setStoredGuestSessionId(newGuest.sessionId);
            localStorage.setItem('guestSessionId', newGuest.sessionId);
            // fetchOrCreateGuestCart(newGuest.sessionId)
            //   .then((cartData) => {
            //     setGuestCart(cartData);
            //     localStorage.setItem("guestCart", JSON.stringify(cartData));
            //   })
            //   .catch((error) => {
            //     console.error('Error fetching guest cart:', error);
            //   });
          })
          .catch((error) => {
            console.error('Error creating new guest:', error);
          });
      }
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
      {/* Header for the App. This components is responsible for Navigation as well as managing user actions such as logging in/out, checking their cart or wishlist, or accessing the admin dashboard for Admins */}
      <Header

        token={token}

        setToken={setToken}

        username={username}

        setIsLoggedIn={setIsLoggedIn}

        category={category}
        setCategory={setCategory}
      />
      {/* This section will change depending on url path. This will update to display products, account information, a user's cart, etc. */}
      <Routes>
        {/* The home screen. This should display some featured products as well as a list of available products for purchase */}
        <Route
          path="/"
          element={

            <div className="home-container">
              {/* <Sidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategory}
              /> */}
              <Home
                selectedCategory={selectedCategory}
                searchTerm={searchTerm}
                // categories={categories}

                productId={productId}

                setProductId={setProductId}

                cart={cart}
                setCart={setCart}
                token={token}
              />
            </div>

          }
        ></Route>

        {/* This page displays an individual product based on it's ID, with all of its information such as Name, Price, Description, Rating, Image, and Reviews */}
        <Route
          path={`/Product/:productId`}
          element={
            <Product productId={productId} setProductId={setProductId} />
          }
        ></Route>

        {/* This page displays a user's cart. The cart page should be unique to each user, showing a list of products selected by the user for purchase */}
        <Route

          path="/Cart"
          element={<Cart token={token} cart={cart} setCart={setCart} />}
        ></Route>

        {/* This page displays a user's past orders. The orders page should be unique to each user, showing a list of previous orders, as well as their status, and dates (date ordered/date received) */}
        <Route path="/Orders" element={<Orders />}></Route>

        {/* This page displays a user's account. This should be unique to each user, and display a list of information linked to their account. This can include username, email address, any additional contact information, saved payment methods, and a profile pic */}
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

        {/* This page displays a user's wishlist. Much like a user's cart, this page displays a list of products for purchase */}
        <Route path="/Wishlist" element={<Wishlist />}></Route>

        {/* This page should display a user edit form. User's should be able to update their password, payment methods, username, and profile pic */}
        <Route
          path="/User/Edit"
          element={
            <AccountForm
              setUsername={setUsername}
              username={username}
              token={token}
              setAndStoreUsername={setAndStoreUsername}
              cart={cart}
              setCart={setCart}
            />
          }
        ></Route>

        {/* This page displays a form for registering new users. It will include fields for a username, email, password, and password confirmation */}
        <Route
          path="/Register"
          element={
            <Register
              token={token}
              setToken={setAndStoreToken}
              username={username}
              setUsername={setUsername}
              setAndStoreUsername={setAndStoreUsername}
              cart={cart}
              setCart={setCart}
            />
          }
        ></Route>

        {/* This page displays a form for Logging in users. It will include fields username, and password */}
        <Route
          path="/Login"
          element={
            <Login
              token={token}
              setToken={setAndStoreToken}
              username={username}
              setUsername={setUsername}
              setAndStoreUsername={setAndStoreUsername}
              cart={cart}
              setCart={setCart}
            />
          }
        ></Route>

        {/* This page displays a list of products by category */}
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

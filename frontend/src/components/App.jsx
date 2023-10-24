import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
// Adds styling to the App and its components
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";

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
  Checkout,
  AdminDashboard,
  Return,
  CheckoutSuccess,
} from "./index";

import { fetchUserCart, fetchGuestCart, createNewGuest, fetchUserOrders, fetchUserData } from "../apiCalls";

import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe('pk_live_51NyLPaIBy4kJpJhvJgIFMYvcqTWfctWpXRoeozfjY2NQDn2DIPwl9MxZDLfz2UzonMyIcPr4A4EYYwu4RhJDJHJ500jNN38Zch')

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
  const [guestCart, setGuestCart] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [storedGuestSessionId, setStoredGuestSessionId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false)
  const [productQuantities, setProductQuantities] = useState({});
  const [clientSecret, setClientSecret] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const storedIsAdmin = localStorage.getItem("isAdmin");
    if (storedIsAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    const storedToken = localStorage.getItem("token");
    const storedGuestSessionId = localStorage.getItem("guestSessionId");

    if (storedToken) {
      console.log('IS ADMIN CHECK APP:', isAdmin);
      setToken(storedToken);
      setIsLoggedIn(true);
      setStoredGuestSessionId('');

      let userData;
      fetchUserCart(storedToken)
        .then((cartData) => {
          setCart(cartData);
          localStorage.setItem("cart", JSON.stringify(cartData));
          return fetchUserData(storedToken);
        })
        .then((data) => {
          userData = data;
          return fetchUserOrders(userData.username, storedToken);
        })
        .then((orders) => {
          setUserId(userData.id);
          setUserOrders(orders);
          console.log("User orders:", orders);
        })
        .catch((error) => {
          console.error("Error fetching user data and orders:", error);
        });
    } else if (storedGuestSessionId && !storedToken) {
      setStoredGuestSessionId(storedGuestSessionId);
      fetchGuestCart(storedGuestSessionId)
        .then((cartData) => {
          if (cartData) {
            setGuestCart(cartData);
            localStorage.setItem("guestCart", JSON.stringify(cartData));
          }
        })
        .catch((error) => {
          console.error('Error fetching guest cart:', error);
        });
    } else {
      if (!token && !storedGuestSessionId) {
        createNewGuest()
          .then((newGuest) => {
            setStoredGuestSessionId(newGuest.sessionId);
            localStorage.setItem('guestSessionId', newGuest.sessionId);
          })
          .catch((error) => {
            console.error('Error creating a new guest:', error);
          });
      }
    }

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    console.log("category:", category);
    console.log("productId:", productId)
    localStorage.setItem("selectedCategory", category);
    localStorage.setItem("productId", productId);
  }, [category, productId]);


  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    const storedProductId = localStorage.getItem("productId");
    if (storedCategory) {
      setCategory(storedCategory);
    }
    if (storedProductId) {
      setProductId(storedProductId);
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
      <Elements clientSecret={clientSecret} stripe={stripePromise}>
        {/* Header for the App. This components is responsible for Navigation as well as managing user actions such as logging in/out, checking their cart or wishlist, or accessing the admin dashboard for Admins */}
        <Header
          productQuantities={productQuantities}
          setProductQuantities={setProductQuantities}
          token={token}
          isAdmin={isAdmin}
          setToken={setToken}
          setIsAdmin={setIsAdmin}
          username={username}
          setUsername={setUsername}
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
                  isAdmin={isAdmin}
                  // categories={categories}
                  storedGuestSessionId={storedGuestSessionId}
                  productId={productId}
                  isLoggedIn={isLoggedIn}
                  setProductId={setProductId}
                  guestCart={guestCart}
                  cart={cart}
                  setCart={setCart}
                  token={token}
                  setGuestCart={setGuestCart}
                  username={username}
                  productQuantities={productQuantities}
                  setProductQuantities={setProductQuantities}
                />
              </div>

            }
          ></Route>

          {/* This page displays an individual product based on it's ID, with all of its information such as Name, Price, Description, Rating, Image, and Reviews */}
          <Route
            path={`/Product/:productId`}
            element={
              <Product
                productId={productId}
                setProductId={setProductId}
                productQuantities={productQuantities}
                setProductQuantities={setProductQuantities}
                setGuestCart={setGuestCart}
                storedGuestSessionId={storedGuestSessionId}
                token={token}
              />
            }
          ></Route>

          {/* This page displays a user's cart. The cart page should be unique to each user, showing a list of products selected by the user for purchase */}
          <Route

            path="/Cart"
            element={<Cart
              storedGuestSessionId={storedGuestSessionId}
              isLoggedIn={isLoggedIn}
              token={token} cart={cart} setCart={setCart}
              guestCart={guestCart}
              setGuestCart={setGuestCart}
              productQuantities={productQuantities}
              setProductQuantities={setProductQuantities}
              userId={userId}
            />}
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
                userOrders={userOrders}
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
                setIsAdmin={setIsAdmin}
                storedGuestSessionId={storedGuestSessionId}
                guestCart={guestCart}
                setIsLoggedIn={setIsLoggedIn}
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
                setIsAdmin={setIsAdmin}
              />
            }
          ></Route>

          {/* This page displays a list of products by category */}
          <Route
            path={`/Products/:category`}
            element={
              <Category
                setCategory={setCategory}
                category={category}
                guestCart={guestCart}
                setGuestCart={setGuestCart}
                storedGuestSessionId={storedGuestSessionId}
                token={token}
                cart={cart}
                setCart={setCart}
                categoryProducts={categoryProducts}
                setCategoryProducts={setCategoryProducts}
                isAdmin={isAdmin}
                productQuantities={productQuantities}
                setProductQuantities={setProductQuantities}
                productId={productId}
                setProductId={setProductId}
              />}
          ></Route>
          <Route
            path={'/Checkout'}
            element={
              <Checkout
                cart={cart}
                token={token}
                setCart={setCart}
                clientSecret={clientSecret} />
            }
          >
          </Route>
          <Route path='/return' element={<Return />}></Route>
          <Route path='/checkout-success'
            element={<CheckoutSuccess
              productQuantities={productQuantities}
              setProductQuantities={setProductQuantities}
            />}></Route>
          <Route
            path={'/AdminDashboard'}
            element={
              <AdminDashboard
                token={token}
              />}>
          </Route>
        </Routes>
        <footer className="footer">
          <Contacts />
        </footer>
      </Elements>
    </BrowserRouter>
  );
};

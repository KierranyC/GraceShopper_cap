import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/App.css";
import { CartProvider } from "../CartContext";

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

import { fetchUserCart, fetchGuestCart, createNewGuest } from "../api";
import { v4 as uuidv4 } from 'uuid';
// This is the Mother of all components. This is what will house all of the other components to render on screen.
export const App = () => {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [cart, setCart] = useState([]);
  const [guestCart, setGuestCart] = useState([]);
  const [storedGuestSessionId, setStoredGuestSessionId] = useState("");

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
          localStorage.setItem("cart", JSON.stringify(cartData));
        })
        .catch((error) => {
          console.error('Error fetching user cart:', error);
        });
    } else if (storedGuestSessionId && !storedToken) {
      setStoredGuestSessionId(storedGuestSessionId);
      fetchGuestCart(storedGuestSessionId)
        .then((cartData) => {
          console.log('FETCHED GUEST CART FROM BACKEND:', cartData)
          if (cartData) {
            setGuestCart(cartData);
            localStorage.setItem("guestCart", JSON.stringify(cartData));
            // console.log(guestCart)
          }
        })
        .catch((error) => {
          console.error('Error fetching guest cart:', error);
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
          <Route exact path="/" element={<Home storedGuestSessionId={storedGuestSessionId} cart={cart} setCart={setCart} token={token}
            isLoggedIn={isLoggedIn} guestCart={guestCart} setGuestCart={setGuestCart} />}></Route>
          <Route exact path="/product/:productId" element={<Product />}></Route>

          <Route exact path="/cart" element={<Cart storedGuestSessionId={storedGuestSessionId} token={token} cart={cart} setCart={setCart}
            isLoggedIn={isLoggedIn} guestCart={guestCart} setGuestCart={setGuestCart} />}></Route>

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
                cart={cart}
                setCart={setCart}
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
                cart={cart}
                setCart={setCart}
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

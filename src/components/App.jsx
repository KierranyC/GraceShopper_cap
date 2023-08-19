import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
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

// Ignore the endless amount of imports, I will clean that up after I reexport files from the components index.js

// This is the Mother of all components. This is what will house all of the other components to render on screen.
const App = () => {
  return (
    <BrowserRouter className="app-container">
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>

        <Route exact path="/product/:productId">
          <Product />
        </Route>

        <Route exact path="/cart">
          <Cart />
        </Route>

        <Route exact path="/orders">
          <Orders />
        </Route>

        <Route exact path="/account">
          <Account />
        </Route>

        <Route exact path="/wishlist">
          <Wishlist />
        </Route>
      </Switch>
      <footer>
        <p>This is the footer!</p>
        <Contacts />
      </footer>
    </BrowserRouter>
  );
};

export default App;

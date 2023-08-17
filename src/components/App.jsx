import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// getAPIHealth is defined in our axios-services directory index.js
// you can think of that directory as a collection of api adapters
// where each adapter fetches specific info from our express server's /api route
import "../style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header/Header";
import Home from "./Body/Home";
import Contacts from "./Body/Contacts";

const App = () => {
  return (
    <body className="app-container">
      <Header />
      <Home />
      <footer>
        <p>This is the footer!</p>
        <Contacts />
      </footer>
    </body>
  );
};

export default App;

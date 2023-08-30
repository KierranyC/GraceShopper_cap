import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/index.js";
import { createRoot } from "react-dom/client";
// css stylesheets can be created for each component
// place them in the src/style directory, and import them like this:
import "./style/App.css";

// ReactDOM.render(<App />, document.getElementById("root"));
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);

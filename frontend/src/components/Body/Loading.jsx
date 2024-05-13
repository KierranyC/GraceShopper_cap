import React from "react";
import { Spinner } from "react-bootstrap";

// This component displays a Loading Spinner, letting the user know that the website is fetching data
export const Loading = () => {
  return (
    <div className="loading-modal active">
      <div className="loading-content">
        <h2 className="loading-message">Loading...</h2>
        <Spinner animation="border" variant="primary" />
      </div>
    </div>
  );
};

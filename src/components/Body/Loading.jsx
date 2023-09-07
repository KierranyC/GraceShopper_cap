import React from "react";
import { Spinner } from "react-bootstrap";

// This component displays a Loading Spinner, letting the user know that the website is fetching data
export const Loading = ({ isLoading }) => {
  return (
    <div>
      <h2 className="loading-message">Searching...</h2>
      {isLoading && <Spinner size="large" />}
    </div>
  );
};

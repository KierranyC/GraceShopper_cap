import React from "react";
import { Spinner } from "react-bootstrap";

export const Loading = ({ isLoading }) => {
  return (
    <div>
      <h2 className="loading-message">Searching...</h2>
      {isLoading && <Spinner size="large" />}
    </div>
  );
};

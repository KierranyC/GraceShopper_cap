import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({ isLoading }) => {
  return (
    <div className={`loading-modal${isLoading ? " active" : ""}`}>
      <div className="loading-content">
        <h2 className="loading-message">Searching...</h2>
        {isLoading && <Spinner animation="border" variant="primary" />}
      </div>
    </div>
  );
};

export default Loading;

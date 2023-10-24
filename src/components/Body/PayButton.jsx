import React from "react";
import { useSelector } from "react-redux";

export const PayButton = ({ cartItems, userId }) => {
  console.log('CART PAYBUTTON:', cartItems)
  console.log('USER ID PAYBUTTON:', userId)
  const handleCheckout = () => {
    // Define the request body
    const requestBody = JSON.stringify({
      cartItems,
      userId: userId,
    });

    // Define request options
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    };

    // Make the fetch request
    fetch(`http://localhost:3000/api/cart/checkout-session`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            if (data.url) {
              window.location.href = data.url;
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <button onClick={() => handleCheckout()}>Check Out</button>
    </>
  )
} 
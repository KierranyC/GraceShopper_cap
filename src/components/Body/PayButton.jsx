import React from "react";
import { useSelector } from "react-redux";

export const PayButton = ({ cartItems, userId }) => {

  // const user = useSelector((state) => state.userId)

  const handleCheckout = () => {
    fetch('http://localhost:4000/api/checkout-session', {
      method: 'POST',

    }
    )
  }
  return (
    <>
      <button onClick={() => handleCheckout()}>Check Out</button>
    </>
  )
} 
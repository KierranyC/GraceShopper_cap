import React, { useEffect } from "react";

export const CheckoutSuccess = ({ setProductQuantities, productQuantities }) => {

  useEffect(() => {
    setProductQuantities({})
    localStorage.setItem(
      "productQuantities",
      JSON.stringify(productQuantities)
    );
  }, []);

  return (
    <>
      <h2>Checkout Success!</h2>
      <p>Your order might take some time to process.</p>
      <p>Check your order status at your profile after about 10mins.</p>
      <p>
        Incase of any inqueries contact the support at{" "}
        <strong>kierranyc@outlook.com</strong>
      </p>
    </>
  )
}


import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export const Cart = ({ isLoggedIn, cart, setCart, guestCart, setGuestCart }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [guestTotalCost, setGuestTotalCost] = useState(0); // New state for guest cart total cost
  console.log(cart)
  useEffect(() => {
    const storageKey = isLoggedIn ? "cart" : "guestCart";
    localStorage.setItem(storageKey, JSON.stringify(isLoggedIn ? cart : guestCart));

    // Calculate total cost based on whether the user is logged in or not
    const cost = (isLoggedIn ? cart : guestCart).reduce((total, product) => {
      const productSubtotal = product.productInfo.price * product.quantity;
      return total + productSubtotal;
    }, 0);

    if (isLoggedIn) {
      setTotalCost(cost);
    } else {
      setGuestTotalCost(cost); // Update guest cart total cost
    }
  }, [cart, guestCart, isLoggedIn]);

  useEffect(() => {
    const storageKey = isLoggedIn ? "cart" : "guestCart";
    const storedCart = localStorage.getItem(storageKey);

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      isLoggedIn ? setCart(parsedCart) : setGuestCart(parsedCart);
    }
  }, [isLoggedIn, setCart, setGuestCart]);

  return (
    <div>
      {isLoggedIn ? (
        <p>Items in your cart:</p>
      ) : (
        <p>Guest cart:</p>
      )}
      {isLoggedIn && cart.length > 0 ? (
        cart.map((currentProduct) => (
          <div key={currentProduct.id}>
            <h1>{currentProduct.productInfo.title}</h1>
            <h2>Price: ${currentProduct.productInfo.price}</h2>
            <h2>Quantity: {currentProduct.quantity}</h2>
            <h2>Subtotal: ${currentProduct.productInfo.price * currentProduct.quantity}</h2>
          </div>
        ))
      ) : (
        isLoggedIn && <h1>There are no items in your cart!</h1>
      )}
      {!isLoggedIn && guestCart.length > 0 && (
        guestCart.map((currentProduct) => (
          <div key={currentProduct.id}>
            <h1>{currentProduct.productInfo.title}</h1>
            <h2>Price: ${currentProduct.productInfo.price}</h2>
            <h2>Quantity: {currentProduct.quantity}</h2>
            <h2>Subtotal: ${currentProduct.productInfo.price * currentProduct.quantity}</h2>
          </div>
        ))
      )}
      {!isLoggedIn && guestCart.length === 0 && (
        <h1>Guest cart is empty.</h1>
      )}
      {isLoggedIn && cart.length > 0 && (
        <h1>Total: ${totalCost}</h1>
      )}
      {!isLoggedIn && guestCart.length > 0 && (
        <h1>Total: ${guestTotalCost}</h1> // Display guest cart total cost for guests
      )}
      <Button variant="primary">Checkout</Button>
    </div>
  );
};

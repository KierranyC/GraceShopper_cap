import React from "react";
import { Button } from "react-bootstrap";

// This component renders the cart. I think this is pretty self explanatory, but this component should have a list of products picked out by the customer, with the price and quantity to be purchased. The quantity should be modifiable and the subtotal should update to reflect those changes. Their should be a field for customers to add payment information, and for users to save payment information if they wish to for future orders.
export const Cart = () => {
  return (
    <div>
      <h1 className="text-center">Your Cart</h1>
      {/* A map of items, preferably stored as Cards that will be generated in the cart */}
      <div className="checkout-costs">
        <p>Subtotal:</p>
        <p>Tax:</p>
        <p>Shipping Fees:</p>
        <p>Total:</p>
      </div>
      <Button variant="primary">Checkout</Button>
    </div>
  );
};

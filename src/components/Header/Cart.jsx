import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { CartContext } from "../../CartContext";
import CartProduct from "./CartProduct";

// This component renders the cart. 
// I think this is pretty self explanatory, 
// but this component should have a list of 
// products picked out by the customer, with 
// the price and quantity to be purchased. The 
// quantity should be modifiable and the subtotal 
// should update to reflect those changes. There should 
// be a field for customers to add payment information, 
// and for users to save payment information if they wish 
// to for future orders.
export const Cart = () => {
  const cart = useContext(CartContext)
  console.log(cart.items)
  const productsCount = cart.items.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <div>
      <h1 className="text-center">Your Cart</h1>
      {/* A map of items, preferably stored as Cards that will be generated in the cart */}
      {/* <div className="checkout-costs">
        <p>Subtotal:</p>
        <p>Tax:</p>
        <p>Shipping Fees:</p>
        <p>Total:</p>
      </div> */}
      {productsCount > 0 ?
        <>
          <p>Items in your cart:</p>
          {cart.items.map((currentProduct, idx) => (
            <CartProduct key={idx} id={currentProduct.id} quantity={currentProduct.quantity}></CartProduct>
          ))}

          <h1>Total: {cart.getTotalCost().toFixed(2)}</h1>

          <Button variant="success" onClick={checkout}>
            Purchase items!
          </Button>
        </>
        :
        <h1>There are no items in your cart!</h1>
      }
      <Button variant="primary">Checkout</Button>
    </div>
  );
};

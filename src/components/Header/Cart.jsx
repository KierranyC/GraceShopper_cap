import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { fetchUserCart } from "../../api";

export const Cart = ({ cart, setCart }) => {
  const [totalCost, setTotalCost] = useState(0);
  console.log(cart)
  // useEffect(() => {
  //   calculateTotalCost(cart);
  // }, [cart]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  // Update cart data in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    calculateTotalCost(cart);
  }, [cart]);

  const calculateTotalCost = (cart) => {
    const cost = cart.reduce((total, product) => {
      const productSubtotal = product.productInfo.price * product.quantity;
      return total + productSubtotal;
    }, 0);
    setTotalCost(cost);
  };

  return (
    <div>
      {cart.length > 0 ? (
        <>
          <p>Items in your cart:</p>
          {cart.map((currentProduct) => (
            <div key={currentProduct.id}>
              <h1>{currentProduct.productInfo.title}</h1>
              <h2>Price: ${currentProduct.productInfo.price}</h2>
              <h2>Quantity: {currentProduct.quantity}</h2>
              <h2>Subtotal: ${currentProduct.productInfo.price * currentProduct.quantity}</h2>
            </div>
          ))}
          <h1>Total: ${totalCost}</h1>
        </>
      ) : (
        <h1>There are no items in your cart!</h1>
      )}
      <Button variant="primary">Checkout</Button>
    </div>
  );
};



































// import React, { useState, useEffect } from "react";
// import { Button } from "react-bootstrap";
// import { fetchUserCart } from "../../api";

// export const Cart = ({ cart }) => {
//   const [totalCost, setTotalCost] = useState(0);
//   console.log(cart)
//   useEffect(() => {
//     calculateTotalCost(cart);
//   }, []);

//   const calculateTotalCost = (cart) => {
//     const cost = cart.reduce((total, product) => {
//       const productSubtotal = product.price * product.quantity;
//       return total + productSubtotal;
//     }, 0);
//     setTotalCost(cost);
//   };
 
//   return (
//     <div>
//       {cart.length > 0 ? (
//         <>
//           <p>Items in your cart:</p>
//           {cart.map((currentProduct) => (
//             <div key={currentProduct.id}>
//               <h1>{currentProduct.title}</h1>
//               <h2>Price: ${currentProduct.price}</h2>
//               <h2>Quantity: {currentProduct.quantity}</h2>
//               <h2>Subtotal: ${currentProduct.price * currentProduct.quantity}</h2>
//             </div>
//           ))}
//           <h1>Total: ${totalCost}</h1>
//           <Button variant="success">Purchase items!</Button>
//         </>
//       ) : (
//         <h1>There are no items in your cart!</h1>
//       )}
//       <Button variant="primary">Checkout</Button>
//     </div>
//   );
// };
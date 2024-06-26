import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  removeItemFromCart,
  addItemToCart,
  updateCartItem,
} from "../../apiCalls/index.js";
import { Navigate, useNavigate } from "react-router";
import { PayButton } from '../Body/PayButton.jsx'

export const Cart = ({
  inCart,
  setInCart,
  token,
  isLoggedIn,
  cart,
  setCart,
  guestCart,
  setGuestCart,
  storedGuestSessionId,
  productQuantities,
  setProductQuantities,
  userId
}) => {
  const [totalCost, setTotalCost] = useState(0);
  const [guestTotalCost, setGuestTotalCost] = useState(0);
  const navigate = useNavigate()
  console.log('USER ID CART FRONT END:', userId)
  useEffect(() => {
    const storageKey = isLoggedIn ? "cart" : "guestCart";
    localStorage.setItem(
      storageKey,
      JSON.stringify(isLoggedIn ? cart : guestCart)
    );

    // calculate total cost of items
    const cost = (isLoggedIn ? cart : guestCart).reduce(
      (total, product) => {
        const productSubtotal = product.productInfo.price * product.quantity;
        return total + productSubtotal;
      },
      0
    );

    if (isLoggedIn) {
      setTotalCost(cost);
    } else {
      setGuestTotalCost(cost); // to update guest cart total cost
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

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [productQuantities]);


  const handleAddOneItemToCart = async (productId) => {
    const updatedQuantity = (productQuantities[productId] || 1) + 1; // Start with a default of 1
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: updatedQuantity,
    }));

    try {
      let updatedCart;

      if (token) {
        updatedCart = await updateCartItem(
          token,
          null,
          productId,
          updatedQuantity
        );
        setCart(updatedCart);
      } else if (storedGuestSessionId) {
        updatedCart = await updateCartItem(
          null,
          storedGuestSessionId,
          productId,
          updatedQuantity
        );
        console.log('UPDATED CART:', updatedCart)
        setGuestCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };

  const handleDeleteOneItemFromCart = async (productId) => {
    try {
      const currentQuantity = productQuantities[productId] || 0;
      let updatedCart;

      if (currentQuantity > 1) {
        const updatedQuantity = currentQuantity - 1;

        setProductQuantities((prevQuantities) => {
          return {
            ...prevQuantities,
            [productId]: updatedQuantity,
          };
        });

        if (storedGuestSessionId) {
          updatedCart = await updateCartItem(null, storedGuestSessionId, productId, updatedQuantity);
          setGuestCart(updatedCart);
        } else if (token) {
          updatedCart = await updateCartItem(token, null, productId, updatedQuantity);
          setCart(updatedCart);
        }
      } else if (currentQuantity === 1) {
        if (storedGuestSessionId) {
          updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
          setGuestCart(updatedCart);
        } else if (token) {
          updatedCart = await removeItemFromCart(token, null, productId);
          setCart(updatedCart);
        }

        setProductQuantities((prevQuantities) => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[productId];
          return newQuantities;
        });
      }
    } catch (error) {
      console.error('Error handling item quantity or removing item from cart:', error);
    }
  };

  const handleCheckout = () => {
    if (token) {
      navigate('/checkout', { state: { cart } })
    } else {
      navigate('/register')
    }
  }

  const guestRegister = () => {
    navigate('/register')
  }

  return (
    <div>
      {isLoggedIn ? (
        <h1>Items in your cart:</h1>
      ) : (
        <p>Guest cart:</p>
      )}
      {isLoggedIn && cart.length > 0 ? (
        cart.map((currentProduct) => {
          if (currentProduct.quantity > 0) {
            return (
              <div key={currentProduct.productId}>
                <h2>{currentProduct.productInfo.title}</h2>
                <h4>Price: ${currentProduct.productInfo.price}</h4>
                <h4>Quantity: {currentProduct.quantity}</h4>
                <h4>
                  Subtotal: $
                  {currentProduct.productInfo.price *
                    currentProduct.quantity}
                </h4>
                <Button
                  onClick={() => {
                    handleAddOneItemToCart(currentProduct.productId)
                  }}>
                  +
                </Button>
                <Button
                  onClick={() =>
                    handleDeleteOneItemFromCart(currentProduct.productId)
                  }
                >
                  -
                </Button>
              </div>
            );
          } else {
            return null;
          }
        })
      ) : (
        isLoggedIn && <h1>There are no items in your cart!</h1>
      )}
      {!isLoggedIn &&
        guestCart.length > 0 &&
        guestCart.map((currentProduct) => {
          if (currentProduct.quantity > 0) {
            return (
              <div key={currentProduct.productId}>
                <h1>{currentProduct.productInfo.title}</h1>
                <h2>Price: ${currentProduct.productInfo.price}</h2>
                <h2>Quantity: {currentProduct.quantity}</h2>
                <h2>
                  Subtotal: $
                  {currentProduct.productInfo.price *
                    currentProduct.quantity}
                </h2>
                <Button
                  onClick={() =>
                    handleAddOneItemToCart(currentProduct.productId)
                  }>
                  +
                </Button>
                <Button
                  onClick={() =>
                    handleDeleteOneItemFromCart(currentProduct.productId)
                  }>
                  -
                </Button>
              </div>
            );
          } else {
            return null;
          }
        })}
      {!isLoggedIn && guestCart.length === 0 && (
        <h1>Guest cart is empty.</h1>
      )}
      {isLoggedIn && cart.length > 0 && (
        <h1>Total: ${totalCost}</h1>
      )}
      {!isLoggedIn &&
        guestCart.length > 0 && (
          <h1>Total: ${guestTotalCost}</h1>
        )}
      {isLoggedIn && cart.length > 0 && (
        <PayButton cartItems={cart} userId={userId} />
      )}
      {!isLoggedIn && guestCart.length > 0 && (
        <Button variant="primary" onClick={(guestRegister)}>Please register or log in to check out</Button>
      )}
    </div>
  );
};
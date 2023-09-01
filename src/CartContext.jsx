import React, { createContext, useState, useEffect } from 'react';
import { fetchAllProducts } from './api';

export const products = await fetchAllProducts()

// async function setupCartContext() {
//   const fetchedProducts = await fetchAllProducts();
//   return fetchedProducts;
// }

export function getProductData(id) {
  let productData = products.find(product => product.id === id);

  if (productData == undefined) {
    console.log("Product data does not exist for ID: " + id);
    return undefined;
  }

  return productData;
}

export const CartContext = createContext({
  items: [],
  getProductQuantity: () => { },
  addOneToCart: () => { },
  removeOneFromCart: () => { },
  deleteFromCart: () => { },
  getTotalCost: () => { }
});

export function CartProvider({ children, setCartProducts, cartProducts }) {
  // const [cartProducts, setCartProducts] = useState([]);

  // useEffect(() => {
  //   // Load cart data from localStorage on component mount
  // const storedCartData = localStorage.getItem('cartData');
  // if (storedCartData) {
  //   setCartProducts(JSON.parse(storedCartData));
  // }
  // }, []);

  // useEffect(() => {
  //   // Save cart data to localStorage whenever it changes
  //   localStorage.setItem('cartData', JSON.stringify(cartProducts));
  // }, [cartProducts]);

  // let localCart = localStorage.getItem("cart");

  // useEffect(() => {
  //   localCart = JSON.parse(localCart)
  //   if (localCart) {
  //     setCartProducts(localCart)
  //   }
  // }, [])

  function getProductQuantity(id) {
    const quantity = cartProducts.find(product => product.id === id)?.quantity;

    if (quantity === undefined) {
      return 0;
    }

    return quantity;
  }

  function addOneToCart(id) {
    const quantity = getProductQuantity(id);

    if (quantity === 0) {
      setCartProducts(
        [
          ...cartProducts,
          {
            id: id,
            quantity: 1
          }
        ]
      )
    } else {
      setCartProducts(
        cartProducts.map(
          product =>
            product.id === id
              ? { ...product, quantity: product.quantity + 1 }
              : product
        )
      )
    }
  }

  function removeOneFromCart(id) {
    const quantity = getProductQuantity(id);

    if (quantity == 1) {
      deleteFromCart(id);
    } else {
      setCartProducts(
        cartProducts.map(
          product =>
            product.id === id
              ? { ...product, quantity: product.quantity - 1 }
              : product
        )
      )
    }
  }

  function deleteFromCart(id) {
    setCartProducts(
      cartProducts =>
        cartProducts.filter(currentProduct => {
          return currentProduct.id != id;
        })
    )
  }

  function getTotalCost() {
    let totalCost = 0;
    cartProducts.map((cartItem) => {
      const productData = getProductData(cartItem.id);
      totalCost += (productData.price * cartItem.quantity);
    });
    return totalCost;
  }

  const contextValue = {
    items: cartProducts,
    getProductQuantity,
    addOneToCart,
    removeOneFromCart,
    deleteFromCart,
    getTotalCost
  }


  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}


export default CartProvider;
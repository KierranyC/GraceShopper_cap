import React, { useState, useEffect } from "react";
import { ButtonGroup, Card } from "react-bootstrap/esm";
import { Reviews } from "./Reviews.jsx";
import { Featured } from "./Featured.jsx";
import { deleteProduct, fetchProduct, addItemToCart, updateCartItem, removeItemFromCart } from "../../apiCalls/index.js";
import { Button } from "react-bootstrap";

// This component renders a single Product based on its ID. It should also display the corresponding reviews with that product, as well as render the products information
export const Product = ({
  setProductId,
  productId,
  productQuantities,
  setProductQuantities,
  setGuestCart,
  storedGuestSessionId,
  token,
  setCart }) => {
  // UseStates for Product
  const [product, setProduct] = useState({});

  // Gets a product everytime productId is updated
  useEffect(() => {
    async function getProduct() {
      try {
        console.log('PRODUCT COMPONENT PRODUCTID:', productId);
        const data = await fetchProduct(productId);
        console.log('PRODUCT COMPONENT PRODUCT DATA:', data);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }
    getProduct();
  }, [productId]);

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);

  useEffect(() => {
    const storedProductId = localStorage.getItem("productId");
    if (storedProductId) {
      setProductId(storedProductId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [productQuantities]);

  const handleAddItemToCart = async (productId) => {
    console.log(storedGuestSessionId)
    try {
      let updatedCart;

      if (token) {
        updatedCart = await addItemToCart(token, null, productId, 1);
        if (updatedCart) {
          setCart(updatedCart);
          setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
          }));
        }
      } else if (storedGuestSessionId) {
        updatedCart = await addItemToCart(null, storedGuestSessionId, productId, 1);
        if (updatedCart) {
          setGuestCart(updatedCart);
          setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
          }));
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleAddOneItemToCart = async (productId) => {
    const updatedQuantity = (productQuantities[productId] || 1) + 1; // Start with a default of 1
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: updatedQuantity,
    }));

    try {
      let updatedCart;

      if (storedGuestSessionId) {
        updatedCart = await updateCartItem(
          null,
          storedGuestSessionId,
          productId,
          updatedQuantity
        );
        setGuestCart(updatedCart);
      } else if (token) {
        updatedCart = await updateCartItem(
          token,
          null,
          productId,
          updatedQuantity
        );
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating item quantity in cart:", error);
    }
  };

  const handleDeleteOneItemFromCart = async (productId) => {
    try {
      const currentQuantity = productQuantities[productId] || 0;
      let updatedCart;

      if (currentQuantity > 0) {
        const updatedQuantity = currentQuantity - 1;

        setProductQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: updatedQuantity,
        }));

        if (storedGuestSessionId) {
          updatedCart = await updateCartItem(null, storedGuestSessionId, productId, updatedQuantity);
          setGuestCart(updatedCart);
        } else if (token) {
          updatedCart = await updateCartItem(token, null, productId, updatedQuantity);
          setCart(updatedCart);
        }
      } else {

        // Always attempt to remove the item from the cart (it's okay if it's not there)
        if (storedGuestSessionId) {
          updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
          setGuestCart(updatedCart);
        } else if (token) {
          updatedCart = await removeItemFromCart(token, null, productId);
          setCart(updatedCart);
        }
      }
    } catch (error) {
      console.error('Error handling item quantity or removing item from cart:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Make an API call to delete the product by productId
      const updatedProducts = await deleteProduct(token, productId);

      // Update the products list by removing the deleted product
      // setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      setCategoryProducts(updatedProducts)
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }

  return (
    <div className="product-page m-3">
      <h2 className="text-center">{product.title}</h2>
      <div className="single-product m-3">
        <img src={product.photo} className="product-image" />
        <Card className="product-information">
          <Card.Text>Price: {product.price}</Card.Text>
          <Card.Text>
            {/* {product.quantity ? <p>In Stock</p> : <p>Out of Stock</p>} */}
          </Card.Text>
          <Card.Text>Category: {product.category}</Card.Text>
          <Card.Text>{product.description}</Card.Text>
          <ButtonGroup>
            {productQuantities[product.id] > 0 ? (
              <>
                <Button onClick={() => handleAddOneItemToCart(product.id)}>+</Button>
                <Button onClick={() => handleDeleteOneItemFromCart(product.id)}>-</Button>
                {/* <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button> */}
              </>
            ) : (
              <Button onClick={() => handleAddItemToCart(product.id)}>Add to Cart</Button>
            )}
            {/* <Button>Add to Wishlist</Button> */}
            {isAdmin && (
              <Button
                variant="danger"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </Button>
            )}
          </ButtonGroup>
        </Card>
      </div>
      {/* <Featured /> */}
      <Reviews />
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  getProductsByCategory,
  removeItemFromCart,
  addItemToCart,
  updateCartItem
} from "../../apiCalls";

// This component displays all products in a category
export const Category = ({
  setProductId,
  productId,
  category,
  setCategory,
  guestCart,
  setGuestCart,
  storedGuestSessionId,
  token,
  cart,
  setCart,
  categoryProducts,
  setCategoryProducts
}) => {
  // UseStates for Category
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  // const [inCart, setInCart] = useState({});
  // console.log(category, categoryProducts)

  // Gets all products by category everytime category is updated
  useEffect(() => {
    async function getProducts() {
      try {
        const data = await getProductsByCategory(category);
        if (Array.isArray(data)) {
          // setProducts(data);
          setCategoryProducts(data)
          // console.log("CategoryProducts", data);
          // console.log("Products, Category", products);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, [category]);

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);

  // // comment!
  // useEffect(() => {
  //   // Initialize a new 'inCart' object

  //   const newInCart = {};

  //   // Update 'inCart' based on the contents of the user cart
  //   for (const item of cart) {
  //     newInCart[item.productId] = true;
  //   }

  //   // Update 'inCart' based on the contents of the guest cart
  //   if (storedGuestSessionId) {
  //     for (const item of guestCart) {
  //       newInCart[item.productId] = true;
  //     }
  //   }

  //   // Set the updated 'inCart' state
  //   setInCart(newInCart);
  // }, [cart, guestCart, storedGuestSessionId]);

  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
    // localStorage.setItem("inCart", JSON.stringify(inCart));
  });

  // When clicking a product, sets the productId to the ID of the product clicked and logs that ID
  const handleClick = (proId) => {
    setProductId(proId);
    console.log(productId);
  };

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
          // setInCart((prevInCart) => ({
          //   ...prevInCart,
          //   [productId]: true,
          // }));
        }
      } else if (storedGuestSessionId) {
        updatedCart = await addItemToCart(null, storedGuestSessionId, productId, 1);
        // console.log(updatedCart)
        if (updatedCart) {
          setGuestCart(updatedCart);
          setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 0) + 1,
          }));
          // setInCart((prevInCart) => ({
          //   ...prevInCart,
          //   [productId]: true,
          // }));
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
        updatedCart = await updateCartItem(null, storedGuestSessionId, productId, updatedQuantity);
        setGuestCart(updatedCart);
      } else if (token) {
        updatedCart = await updateCartItem(token, null, productId, updatedQuantity); // Pass productId and updatedQuantity
        setCart(updatedCart);
      }
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };

  const handleDeleteOneItemFromCart = async (productId) => {
    try {
      const currentQuantity = productQuantities[productId]
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
      }

      if (storedGuestSessionId) {
        updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
        setGuestCart(updatedCart);
      } else if (token) {
        updatedCart = await removeItemFromCart(token, null, productId);
        setCart(updatedCart);
      }

      // Set inCart to false regardless of the currentQuantity
      // setInCart((prevInCart) => ({
      //   ...prevInCart,
      //   [productId]: false,
      // }));
    } catch (error) {
      console.error('Error handling item quantity or removing item from cart:', error);
    }
  };


  return (
    <div className="container-fluid">
      <h1 className="text-center">Product</h1>
      <Row className="products mb-3">
        {categoryProducts.map((product) => (
          <Col
            key={product.id}
            value={product}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <Card.Body>
              <Card.Img variant="top" src="/images/img-not-found.png" />
              <Link
                to={`/Product/${product.id}`}
                onClick={() => handleClick(product.id)}
              >
                <Card.Title>{product.title}</Card.Title>
              </Link>
              <Card.Subtitle>{product.price}</Card.Subtitle>
              {productQuantities[product.id] > 0 ? (
                <>
                  <Button onClick={() => handleAddOneItemToCart(product.id)}>+</Button>
                  <Button onClick={() => handleDeleteOneItemFromCart(product.id)}>-</Button>
                  {/* <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button> */}
                </>
              ) : (
                <Button onClick={() => handleAddItemToCart(product.id)}>Add to Cart</Button>
              )}
              <Button>Add to Wishlist</Button>
            </Card.Body>
          </Col>
        ))}
      </Row>
    </div>
  );
};

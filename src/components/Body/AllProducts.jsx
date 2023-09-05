import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { removeItemFromCart, fetchAllProducts, addItemToCart, fetchUserCart, createUserCart, updateCartItem } from "../../api";
// import { useContext } from "react";
// import { CartContext } from "../../CartContext";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ guestCart, setGuestCart, storedGuestSessionId, token, setId, isLoggedIn, cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [inCart, setInCart] = useState({});
  // console.log(cart, token)

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);


  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
        // initializeStateFromLocalStorage(); // Initialize state from localStorage
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  useEffect(() => {
    // Initialize a new 'inCart' object

    const newInCart = {};

    // Update 'inCart' based on the contents of the user cart
    for (const item of cart) {
      newInCart[item.productId] = true;
    }

    // Update 'inCart' based on the contents of the guest cart
    if (storedGuestSessionId) {
      for (const item of guestCart) {
        newInCart[item.productId] = true;
      }
    }

    // Set the updated 'inCart' state
    setInCart(newInCart);
  }, [cart, guestCart, storedGuestSessionId]);


  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
    localStorage.setItem("inCart", JSON.stringify(inCart));
  }, [productQuantities, inCart]);

  const handleAddItemToCart = async (productId) => {
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
          setInCart((prevInCart) => ({
            ...prevInCart,
            [productId]: true,
          }));
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
          setInCart((prevInCart) => ({
            ...prevInCart,
            [productId]: true,
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
      }

      // Always attempt to remove the item from the cart (it's okay if it's not there)
      if (storedGuestSessionId) {
        updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
        setGuestCart(updatedCart);
      } else if (token) {
        updatedCart = await removeItemFromCart(token, null, productId);
        setCart(updatedCart);
      }

      // Set inCart to false regardless of the currentQuantity
      setInCart((prevInCart) => ({
        ...prevInCart,
        [productId]: false,
      }));
    } catch (error) {
      console.error('Error handling item quantity or removing item from cart:', error);
    }
  };


  return (
    <div className="container-fluid">
      <h1 className="text-center">Products</h1>
      <Row className="products">
        {products.map((product) =>

          <Col
            key={product.id}
            value={product}
            md={4}
            className="product-card mb-3"
          >
            <Card.Body>
              {/*<Card.Img variant="top">{product.image}</Card.Img>*/}
              <Card.Title>{product.title}</Card.Title>
              <Card.Subtitle>${product.price}</Card.Subtitle>
              {productQuantities[product.id] > 0 ? (
                <>
                  <Button onClick={() => handleAddOneItemToCart(product.id)}>+</Button>
                  <Button onClick={() => handleDeleteOneItemFromCart(product.id)}>-</Button>
                  {/* <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button> */}
                </>
              ) : (
                <Button onClick={() => handleAddItemToCart(product.id)}>Add to Cart</Button>
              )}

            </Card.Body>
          </Col>
        )}
      </Row>
    </div>
  );
};
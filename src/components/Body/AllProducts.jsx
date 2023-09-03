import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { removeItemFromCart, fetchAllProducts, addItemToCart, fetchUserCart, createUserCart, updateCartItem } from "../../api";
// import { useContext } from "react";
// import { CartContext } from "../../CartContext";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ token, setId, loggedIn, cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  useEffect(() => {
    // Load product quantities from localStorage when the component mounts
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);

  // Update product quantities in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [productQuantities]);

  const handleAddItemToCart = async (productId) => {
    const updatedCart = await addItemToCart(token, productId, 1);
    setCart(updatedCart);
    // Update the quantity in the local state
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  };


  const handleAddOneItemToCart = async (productId) => {
    const updatedQuantity = (productQuantities[productId] || 0) + 1;
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: updatedQuantity,
    }));

    // Send an API request to update the quantity in the database
    const updatedCart = await updateCartItem(token, productId, updatedQuantity);
    setCart(updatedCart);
  };

  const handleDeleteOneItemFromCart = async (productId) => {
    const currentQuantity = productQuantities[productId] || 0;
    if (currentQuantity > 0) {
      const updatedQuantity = currentQuantity - 1;
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: updatedQuantity,
      }));

      // Send an API request to update the quantity in the database
      const updatedCart = await updateCartItem(token, productId, updatedQuantity);
      setCart(updatedCart);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const updatedCart = await removeItemFromCart(token, productId);
    setCart(updatedCart);

    // Remove the quantity from local state
    setProductQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[productId];
      return updatedQuantities;
    });
  };


  const isInCart = (productId) => {
    console.log(cart)
    return cart.some((item) => item.productId === productId);
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
              {isInCart(product.id) ? (
                <>
                  <Button onClick={() => handleAddOneItemToCart(product.id)}>+</Button>
                  <Button onClick={() => handleDeleteOneItemFromCart(product.id)}>-</Button>
                  <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleAddItemToCart(product.id)}>Add to Cart</Button>
                </>
              )}
            </Card.Body>
          </Col>
        )}
      </Row>
    </div>
  );
};
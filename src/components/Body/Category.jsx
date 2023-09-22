import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  deleteProduct,
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
  setCategoryProducts,
  isAdmin,
  inCart,
  setInCart,
  productQuantities,
  setProductQuantities
}) => {
  // UseStates for Category
  const [products, setProducts] = useState([]);

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

  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [productQuantities]);

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
            <Card.Body className="product-card">
              <Card.Img
                className="product-image"
                variant="top"
                src={product.photo}
              />
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
              {isAdmin && (
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </Button>
              )}
              <Button>Add to Wishlist</Button>
            </Card.Body>
          </Col>
        ))}
      </Row>
    </div>
  );
};

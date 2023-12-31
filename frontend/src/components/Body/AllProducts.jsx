import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, InputGroup, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  deleteProduct,
  removeItemFromCart,
  fetchAllProducts,
  addItemToCart,
  fetchUserCart,
  createUserCart,
  updateCartItem,
} from "../../apiCalls";
import { Carousel } from "react-bootstrap/esm";
import { Product } from "./Product";
import { Loading } from "./Loading";

export const Products = ({
  guestCart,
  setGuestCart,
  storedGuestSessionId,
  token,
  setId,
  isLoggedIn,
  cart,
  setCart,
  isAdmin,
  setProductId,
  featuredProducts,
  inCart,
  setInCart,
  productQuantities,
  setProductQuantities,
  isLoading,
  setIsLoading
}) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [productQuantities]);

  useEffect(() => {
    filter();
  }, [searchTerm]);

  const handleClick = (productId) => {
    setProductId(productId);
    localStorage.setItem('productId', productId);
  };

  const filter = () => {
    const lowerCaseQuery = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredProducts(filtered);
  };

  // const handleAddItemToCart = async (productId) => {
  //   try {
  //     let updatedCart;

  //     if (token) {
  //       updatedCart = await addItemToCart(token, null, productId, 1);
  //       if (updatedCart) {
  //         setCart(updatedCart);
  //         setProductQuantities((prevQuantities) => ({
  //           ...prevQuantities,
  //           [productId]: (prevQuantities[productId] || 0) + 1,
  //         }));
  //       }
  //     } else if (storedGuestSessionId) {
  //       updatedCart = await addItemToCart(null, storedGuestSessionId, productId, 1);
  //       if (updatedCart) {
  //         setGuestCart(updatedCart);
  //         setProductQuantities((prevQuantities) => ({
  //           ...prevQuantities,
  //           [productId]: (prevQuantities[productId] || 0) + 1,
  //         }));
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error adding item to cart:', error);
  //   }
  // };

  const handleAddItemToCart = async (productId) => {
    console.log(storedGuestSessionId);
    try {
      let updatedCart;

      if (token) {
        updatedCart = await addItemToCart(token, null, productId, 1);
        if (updatedCart) {
          setCart(updatedCart);
          setProductQuantities((prevQuantities) => {
            return {
              ...prevQuantities,
              [productId]: (prevQuantities[productId] || 0) + 1,
            };
          });
        }
      } else if (storedGuestSessionId) {
        updatedCart = await addItemToCart(null, storedGuestSessionId, productId, 1);
        if (updatedCart) {
          setGuestCart(updatedCart);
          setProductQuantities((prevQuantities) => {
            return {
              ...prevQuantities,
              [productId]: (prevQuantities[productId] || 0) + 1,
            };
          });
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleAddOneItemToCart = async (productId) => {
    const updatedQuantity = (productQuantities[productId] || 1) + 1;
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

  // const handleDeleteOneItemFromCart = async (productId) => {
  //   try {
  //     const currentQuantity = productQuantities[productId] || 0;
  //     let updatedCart;

  //     if (currentQuantity > 0) {
  //       const updatedQuantity = currentQuantity - 1;

  //       setProductQuantities((prevQuantities) => ({
  //         ...prevQuantities,
  //         [productId]: updatedQuantity,
  //       }));

  //       if (storedGuestSessionId) {
  //         updatedCart = await updateCartItem(null, storedGuestSessionId, productId, updatedQuantity);
  //         setGuestCart(updatedCart);
  //       } else if (token) {
  //         updatedCart = await updateCartItem(token, null, productId, updatedQuantity);
  //         setCart(updatedCart);
  //       }
  //     } else {
  //       if (storedGuestSessionId) {
  //         updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
  //         setGuestCart(updatedCart);
  //       } else if (token) {
  //         updatedCart = await removeItemFromCart(token, null, productId);
  //         setCart(updatedCart);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error handling item quantity or removing item from cart:', error);
  //   }
  // };

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
        // Remove the item from the cart
        if (storedGuestSessionId) {
          updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
          setGuestCart(updatedCart);
        } else if (token) {
          updatedCart = await removeItemFromCart(token, null, productId);
          setCart(updatedCart);
        }

        // Also reset the quantity in local state to 0
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

  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  const handleSearch = () => {
    // Trigger the search logic here based on the `searchTerm`
    filter(); // You may use your existing filter logic here
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const updatedProducts = await deleteProduct(token, productId);
      setCategoryProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (isLoading) {
    return <Loading />
  } else {
    return (
      <div className="container-fluid">
        <div className="text-center">
          {/* Search bar */}
          <div className="search-bar-container">
            <InputGroup className="search-bar-container input">
              <FormControl
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* <Button variant="primary" onClick={handleSearch} className="search-bar-container button">
                Search
              </Button> */}
            </InputGroup>
          </div>
          <h2>Featured Products</h2>
          {featuredProducts.length > 0 ? (
            <Carousel className="carousel">
              {featuredProducts.map((product) => (
                <Carousel.Item key={product.id}>
                  <Link
                    to={`/Product/${product.id}`}
                    onClick={() => handleClick(product.id)}
                    className="text-decoration-none"
                  >
                    <img
                      src={product.photo}
                      alt={product.title}
                      className="featured"
                    />
                    <Carousel.Caption>
                      <h3>{product.title}</h3>
                    </Carousel.Caption>
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <p>No featured products available.</p>
          )}
        </div>

        <h1 className="text-center">Products</h1>
        <Row className="products">
          {productsToDisplay.map((product) => (
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
                  className="text-decoration-none"
                  to={`/Product/${product.id}`}
                  onClick={() => handleClick(product.id)}
                >
                  <Card.Title>{product.title}</Card.Title>
                </Link>
                <Card.Subtitle>${product.price}</Card.Subtitle>
                {productQuantities[product.id] > 0 ? (
                  <>
                    <Button onClick={() => handleAddOneItemToCart(product.id)}>
                      +
                    </Button>
                    <Button
                      onClick={() => handleDeleteOneItemFromCart(product.id)}
                    >
                      -
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleAddItemToCart(product.id)}>
                    Add to Cart
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                )}
              </Card.Body>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
};
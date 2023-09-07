import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
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

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
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
}) => {
  // UseStates for Products
  // comment!
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    // const storedInCart = localStorage.getItem("inCart");

    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }

    // if (storedInCart) {
    //   setInCart(JSON.parse(storedInCart));
    // }
  }, []);

  // Gets all products once at the startup of this component
  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  // comment!
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

  // comment!
  useEffect(() => {
    localStorage.setItem(
      "productQuantities",
      JSON.stringify(productQuantities)
    );
    localStorage.setItem("inCart", JSON.stringify(inCart));
  }, [productQuantities, inCart]);

  // Filters products depending on the searchTerm
  useEffect(() => {
    filter();
  }, [searchTerm]);

  // When clicking a product, sets the productId to the ID of the product clicked and logs that ID
  const handleClick = (productId) => {
    setProductId(productId);
    console.log(productId);
  };

  // A function for filtering based on a string search. Converts the search to lowercase and filters products for matching titles or descriptions in products
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

  const handleAddItemToCart = async (productId) => {
    console.log(storedGuestSessionId);
    try {
      let updatedCart;

      if (token) {
        updatedCart = await addItemToCart(token, null, productId, 1);
        if (updatedCart) {
          // console.log('UPDATED CART FRONT END PRODUCTS:', updatedCart)
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
        updatedCart = await addItemToCart(
          null,
          storedGuestSessionId,
          productId,
          1
        );
      } else if (storedGuestSessionId && !token) {
        updatedCart = await addItemToCart(null, storedGuestSessionId, productId, 1);
        // console.log(updatedCart)
        if (updatedCart) {
          // console.log('UPDATED CART FRONT END PRODUCTS:', updatedCart)
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
      console.error("Error adding item to cart:", error);
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
        ); // Pass productId and updatedQuantity
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Error updating item quantity in cart:", error);
    }
  };

  const handleDeleteOneItemFromCart = async (productId) => {
    try {
      const currentQuantity = productQuantities[productId]
      console.log('CURRENT QUANTITY:', currentQuantity)
      let updatedCart;

      if (currentQuantity > 0) {
        const updatedQuantity = currentQuantity - 1;

        setProductQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: updatedQuantity,
        }));

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
      }
      // Always attempt to remove the item from the cart (it's okay if it's not there)
      if (storedGuestSessionId) {
        updatedCart = await removeItemFromCart(
          null,
          storedGuestSessionId,
          productId
        );
        setGuestCart(updatedCart);
        updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
        console.log(updatedCart)
        // setGuestCart(updatedCart);
        // setInCart((prevInCart) => ({
        //   ...prevInCart,
        //   [productId]: false,
        // }));
      } else if (token) {
        updatedCart = await removeItemFromCart(token, null, productId);
        setCart(updatedCart);
        // setInCart((prevInCart) => ({
        //   ...prevInCart,
        //   [productId]: false,
        // }));
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

  // A variable for updating the products displayed on screen. If there is no searchTerm, shows all products
  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  return (
    <div className="container-fluid">
      <div className="text-center">
        <h2>Featured Products</h2>
        {featuredProducts.length > 0 ? (
          <Carousel>
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
                    className="d-block w-100"
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
      <Row className="products ">
        {products.map((product) => (
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
                  {/* <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button> */}
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
              <Button>Add to Wishlist</Button>
            </Card.Body>
          </Col>
        ))}
      </Row>
    </div>
  );
};

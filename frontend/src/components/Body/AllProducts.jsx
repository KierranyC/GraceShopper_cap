import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
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

  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  const handleDeleteProduct = async (productId) => {
    try {
      const updatedProducts = await deleteProduct(token, productId);
      setCategoryProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div className="container-fluid">
        <div className="text-center">
          {/* Search bar */}
          <div className="d-flex justify-content-center my-3">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
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

































// import React, { useState, useEffect } from "react";
// import { Button, Card, Col, Row } from "react-bootstrap";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   deleteProduct,
//   removeItemFromCart,
//   fetchAllProducts,
//   addItemToCart,
//   fetchUserCart,
//   createUserCart,
//   updateCartItem,
// } from "../../apiCalls";
// import { Carousel } from "react-bootstrap/esm";
// import { Product } from "./Product";

// // This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
// export const Products = ({
//   guestCart,
//   setGuestCart,
//   storedGuestSessionId,
//   token,
//   setId,
//   isLoggedIn,
//   cart,
//   setCart,
//   isAdmin,
//   setProductId,
//   featuredProducts,
//   inCart,
//   setInCart,
//   productQuantities,
//   setProductQuantities,
//   isLoading,
//   setIsLoading
// }) => {
//   // UseStates for Products
//   // comment!
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   // const [productQuantities, setProductQuantities] = useState({});
//   // const [inCart, setInCart] = useState(false);
//   const navigate = useNavigate()
//   // COMMENT

//   useEffect(() => {
//     const storedQuantities = localStorage.getItem("productQuantities");
//     if (storedQuantities) {
//       setProductQuantities(JSON.parse(storedQuantities));
//     }
//   }, []);

//   // Gets all products once at the startup of this component
//   useEffect(() => {
//     async function getProducts() {
//       try {
//         const data = await fetchAllProducts();
//         setProducts(data);
//         setIsLoading(false)
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     }
//     getProducts();
//   }, []);



//   // comment!
//   useEffect(() => {
//     localStorage.setItem(
//       "productQuantities",
//       JSON.stringify(productQuantities)
//     );
//   }, [productQuantities]);


//   // Filters products depending on the searchTerm
//   useEffect(() => {
//     filter();
//   }, [searchTerm]);

//   // When clicking a product, sets the productId to the ID of the product clicked and logs that ID
//   const handleClick = (productId) => {
//     setProductId(productId);
//     localStorage.setItem('productId', productId)
//   };

//   // A function for filtering based on a string search. Converts the search to lowercase and filters products for matching titles or descriptions in products
//   const filter = () => {
//     const lowerCaseQuery = searchTerm.toLowerCase();
//     const filtered = products.filter((product) => {
//       return (
//         product.title.toLowerCase().includes(lowerCaseQuery) ||
//         product.description.toLowerCase().includes(lowerCaseQuery)
//       );
//     });
//     setFilteredProducts(filtered);
//   };

//   const handleAddItemToCart = async (productId) => {
//     console.log(storedGuestSessionId)
//     try {
//       let updatedCart;

//       if (token) {
//         updatedCart = await addItemToCart(token, null, productId, 1);
//         if (updatedCart) {
//           setCart(updatedCart);
//           setProductQuantities((prevQuantities) => ({
//             ...prevQuantities,
//             [productId]: (prevQuantities[productId] || 0) + 1,
//           }));
//         }
//       } else if (storedGuestSessionId) {
//         updatedCart = await addItemToCart(null, storedGuestSessionId, productId, 1);
//         if (updatedCart) {
//           setGuestCart(updatedCart);
//           setProductQuantities((prevQuantities) => ({
//             ...prevQuantities,
//             [productId]: (prevQuantities[productId] || 0) + 1,
//           }));
//         }
//       }
//     } catch (error) {
//       console.error('Error adding item to cart:', error);
//     }
//   };

//   const handleAddOneItemToCart = async (productId) => {
//     const updatedQuantity = (productQuantities[productId] || 1) + 1; // Start with a default of 1
//     setProductQuantities((prevQuantities) => ({
//       ...prevQuantities,
//       [productId]: updatedQuantity,
//     }));

//     try {
//       let updatedCart;

//       if (storedGuestSessionId) {
//         updatedCart = await updateCartItem(
//           null,
//           storedGuestSessionId,
//           productId,
//           updatedQuantity
//         );
//         setGuestCart(updatedCart);
//       } else if (token) {
//         updatedCart = await updateCartItem(
//           token,
//           null,
//           productId,
//           updatedQuantity
//         );
//         setCart(updatedCart);
//       }
//     } catch (error) {
//       console.error("Error updating item quantity in cart:", error);
//     }
//   };

//   const handleDeleteOneItemFromCart = async (productId) => {
//     try {
//       const currentQuantity = productQuantities[productId] || 0;
//       let updatedCart;

//       if (currentQuantity > 0) {
//         const updatedQuantity = currentQuantity - 1;

//         setProductQuantities((prevQuantities) => ({
//           ...prevQuantities,
//           [productId]: updatedQuantity,
//         }));

//         if (storedGuestSessionId) {
//           updatedCart = await updateCartItem(null, storedGuestSessionId, productId, updatedQuantity);
//           setGuestCart(updatedCart);
//         } else if (token) {
//           updatedCart = await updateCartItem(token, null, productId, updatedQuantity);
//           setCart(updatedCart);
//         }
//       } else {

//         // Always attempt to remove the item from the cart (it's okay if it's not there)
//         if (storedGuestSessionId) {
//           updatedCart = await removeItemFromCart(null, storedGuestSessionId, productId);
//           setGuestCart(updatedCart);
//         } else if (token) {
//           updatedCart = await removeItemFromCart(token, null, productId);
//           setCart(updatedCart);
//         }
//       }
//     } catch (error) {
//       console.error('Error handling item quantity or removing item from cart:', error);
//     }
//   };

//   // A variable for updating the products displayed on screen. If there is no searchTerm, shows all products
//   const productsToDisplay = searchTerm.length ? filteredProducts : products;

//   const handleDeleteProduct = async (productId) => {
//     try {
//       // Make an API call to delete the product by productId
//       const updatedProducts = await deleteProduct(token, productId);

//       // Update the products list by removing the deleted product
//       // setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
//       setCategoryProducts(updatedProducts)
//     } catch (error) {
//       console.error('Error deleting product:', error);
//     }
//   }

//   if (isLoading) {
//     return <h1>Loading...</h1>
//   } else {

//     return (
//       <div className="container-fluid">
//         <div className="text-center">
//           <h2>Featured Products</h2>
//           {featuredProducts.length > 0 ? (
//             <Carousel className="carousel">
//               {featuredProducts.map((product) => (
//                 <Carousel.Item key={product.id}>
//                   <Link
//                     to={`/Product/${product.id}`}
//                     onClick={() => handleClick(product.id)}
//                     className="text-decoration-none"
//                   >
//                     <img
//                       src={product.photo}
//                       alt={product.title}
//                       className="featured"
//                     />
//                     <Carousel.Caption>
//                       <h3>{product.title}</h3>
//                     </Carousel.Caption>
//                   </Link>
//                 </Carousel.Item>
//               ))}
//             </Carousel>
//           ) : (
//             <p>No featured products available.</p>
//           )}
//         </div>
//         <h1 className="text-center">Products</h1>
//         <Row className="products ">
//           {products.map((product) => (
//             <Col
//               key={product.id}
//               value={product}
//               xs={12}
//               sm={6}
//               md={4}
//               lg={3}
//               xl={2}
//             >
//               <Card.Body className="product-card">
//                 <Card.Img
//                   className="product-image"
//                   variant="top"
//                   src={product.photo}
//                 />
//                 <Link
//                   className="text-decoration-none"
//                   to={`/Product/${product.id}`}
//                   onClick={() => handleClick(product.id)}
//                 >
//                   <Card.Title>{product.title}</Card.Title>
//                 </Link>
//                 <Card.Subtitle>${product.price}</Card.Subtitle>
//                 {productQuantities[product.id] > 0 ? (
//                   <>
//                     <Button onClick={() => handleAddOneItemToCart(product.id)}>
//                       +
//                     </Button>
//                     <Button
//                       onClick={() => handleDeleteOneItemFromCart(product.id)}
//                     >
//                       -
//                     </Button>
//                     {/* <Button onClick={() => handleRemoveFromCart(product.id)}>Remove</Button> */}
//                   </>
//                 ) : (
//                   <Button onClick={() => handleAddItemToCart(product.id)}>
//                     Add to Cart
//                   </Button>
//                 )}
//                 {isAdmin && (
//                   <Button
//                     variant="danger"
//                     onClick={() => handleDeleteProduct(product.id)}
//                   >
//                     Delete
//                   </Button>
//                 )}
//                 {/* <Button>Add to Wishlist</Button> */}
//               </Card.Body>
//             </Col>
//           ))}
//         </Row>
//       </div>
//     );
//   }
// };

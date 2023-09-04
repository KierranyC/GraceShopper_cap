import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {
  removeItemFromCart,
  fetchAllProducts,
  addItemToCart,
  fetchUserCart,
  createUserCart,
  updateCartItem,
} from "../../api";
import { Link, useNavigate } from "react-router-dom";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({
  setProductId,
  productId,
  loggedIn,
  token,
  setUserId,
  cart,
  setCart,
}) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const navigate = useNavigate();
=======
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../../apiCalls";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ setProductId, productId, loggedIn }) => {
  // UseStates for Products
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
>>>>>>> comments

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

  // Filters products depending on the searchTerm
  useEffect(() => {
    filter();
  }, [searchTerm]);

  // When clicking a product, sets the productId to the ID of the product clicked and logs that ID
  const handleClick = (productId) => {
    setProductId(productId);
    console.log(productId);
  };

<<<<<<< HEAD
  useEffect(() => {
    // Load product quantities from localStorage when the component mounts
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);

  // Update product quantities in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "productQuantities",
      JSON.stringify(productQuantities)
    );
  }, [productQuantities]);

  useEffect(() => {
    const storedQuantities = localStorage.getItem("productQuantities");
    if (storedQuantities) {
      setProductQuantities(JSON.parse(storedQuantities));
    }
  }, []);

  const handleAddItemToCart = async (proId) => {
    const updatedCart = await addItemToCart(token, proId, 1);
    setCart(updatedCart);
    // Update the quantity in the local state
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [proId]: (prevQuantities[proId] || 0) + 1,
    }));
  };

  const handleAddOneItemToCart = async (proId) => {
    const updatedQuantity = (productQuantities[proId] || 0) + 1;
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [proId]: updatedQuantity,
    }));

    // Send an API request to update the quantity in the database
    const updatedCart = await updateCartItem(token, proId, updatedQuantity);
    setCart(updatedCart);
  };

  const handleDeleteOneItemFromCart = async (proId) => {
    const currentQuantity = productQuantities[proId] || 0;
    if (currentQuantity > 0) {
      const updatedQuantity = currentQuantity - 1;
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [proId]: updatedQuantity,
      }));

      // Send an API request to update the quantity in the database
      const updatedCart = await updateCartItem(token, proId, updatedQuantity);
      setCart(updatedCart);
    }
  };

  const handleRemoveFromCart = async (proId) => {
    const updatedCart = await removeItemFromCart(token, proId);
    setCart(updatedCart);

    // Remove the quantity from local state
    setProductQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[proId];
      return updatedQuantities;
    });
  };

  const isInCart = (proId) => {
    console.log(cart);
    if (cart && cart.length > 0) {
      return cart.some((item) => item.proId === proId);
    }
    return false;
  };
=======
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

  // A variable for updating the products displayed on screen. If there is no searchTerm, shows all products
  const productsToDisplay = searchTerm.length ? filteredProducts : products;
>>>>>>> comments

  return (
    <div className="container-fluid">
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
                src="/images/img-not-found.png"
              />
              <Link
                className="text-decoration-none"
                to={`/Product/${product.id}`}
                onClick={() => handleClick(product.id)}
              >
                <Card.Title>{product.title}</Card.Title>
              </Link>
<<<<<<< HEAD
              <Card.Subtitle>{product.price}</Card.Subtitle>
              {isInCart(product.id) ? (
                <>
                  <Button onClick={() => handleAddOneItemToCart(product.id)}>
                    +
                  </Button>
                  <Button
                    onClick={() => handleDeleteOneItemFromCart(product.id)}
                  >
                    -
                  </Button>
                  <Button onClick={() => handleRemoveFromCart(product.id)}>
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleAddItemToCart(product.id)}>
                    Add to Cart
                  </Button>
                </>
              )}
=======
              <Card.Subtitle>${product.price}</Card.Subtitle>
              <Button>Add to Cart</Button>
>>>>>>> comments
              <Button>Add to Wishlist</Button>
            </Card.Body>
          </Col>
        ))}
      </Row>
    </div>
  );
};

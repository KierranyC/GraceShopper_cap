import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { fetchAllProducts } from "../../api";
import { useContext } from "react";
import { CartContext } from "../../CartContext";

// This component displays all products in the database. I thought about adding filters/categories to this component, but found it to be more fitting in the Header via searching with a category or clicking on a specific category(subnav work in progress) and updating the list of products to show only those matching that category
export const Products = ({ setId, loggedIn }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const cart = useContext(CartContext)

  useEffect(() => {
    async function getProducts() {
      try {
        const data = await fetchAllProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    getProducts();
  }, []);

  const handleClick = (productId) => {
    setId(productId);
  };

  const filter = () => {
    const filtered = products.filter((product) => {
      const lowerCaseQuery = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredProducts(filtered);
    console.log(filtered);
  };

  const productsToDisplay = searchTerm.length ? filteredProducts : products;

  return (
    <div className="container-fluid">
      <h1 className="text-center">Products</h1>
      <Row className="products">
        {products.map((product) => {
          const productQuantity = cart.getProductQuantity(product.id);

          return (
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
                {productQuantity > 0 ?
                  <>
                    <Form as={Row}>
                      <Form.Label column="true" sm="6">In Cart: {productQuantity}</Form.Label>
                      <Col sm="6">
                        <Button sm="6" onClick={() => cart.addOneToCart(product.id)} className="mx-2">+</Button>
                        <Button sm="6" onClick={() => cart.removeOneFromCart(product.id)} className="mx-2">-</Button>
                      </Col>
                    </Form>
                    <Button variant="danger" onClick={() => cart.deleteFromCart(product.id)} className="my-2">Remove from cart</Button>
                  </>
                  :
                  <Button variant="primary" onClick={() => cart.addOneToCart(product.id)}>Add To Cart</Button>
                }
              </Card.Body>
            </Col>
          )
        })}
      </Row>
    </div>
  );
};

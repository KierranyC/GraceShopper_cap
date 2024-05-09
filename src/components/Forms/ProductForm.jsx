import React, { useState } from "react";
import { createProduct } from "../../apiCalls";
import { Form, Button } from 'react-bootstrap'
// This component is primarily for Admins. This form will render a form with fields to enter a product name, price, description, image, and stock quantity.

// This component COULD become a Modal but not sure how to get them working yet :(
export const ProductForm = ({ token }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [productCategory, setProductCategory] = useState('')
  const [photo, setPhoto] = useState('')
  const [featured, setFeatured] = useState(false)


  const handleCreateNewProduct = async () => {
    try {
      console.log(token)
      const response = await createProduct(
        token,
        title,
        description,
        price,
        quantity,
        productCategory,
        photo,
        featured
      )
      setTitle('')
      setDescription('')
      setPrice('')
      setQuantity('')
      setProductCategory('')
      setPhoto('')
      setFeatured(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h2>Create a New Product</h2>
      <Form>
        <Form.Group controlId="title">
          <Form.Label>Product Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="productCategory">
          <Form.Label>Product Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product category"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="photo">
          <Form.Label>Photo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="featured">
          <Form.Check
            type="checkbox"
            label="Featured Product"
            checked={featured}
            onChange={() => setFeatured(!featured)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleCreateNewProduct}>
          Create Product
        </Button>
      </Form>
    </div>
  );
};

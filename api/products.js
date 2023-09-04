import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByTitle,
  getProductsByCategory,
  updateProduct,
  getProductsBySearch,
} from "../db/models/products.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.headers.authorization) {
    next();
  }

  const { title, description, price, quantity, category, photo } = req.body;
  try {
    const newProduct = await createProduct({
      title,
      description,
      price,
      quantity,
      category,
      photo,
    });

    res.send(newProduct);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await getProductById(productId);

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({
        error: "ERROR",
        message: `Product ${productId} not found`,
        title: "productNotFound",
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({
      error: "ERROR",
      message: "Internal server error while fetching product",
      title: "internalServerError",
    });
  }
});

router.patch("/:productId", async (req, res, next) => {
  if (!req.headers.authorization) {
    next();
  }

  const { productId } = req.params;
  const { title, description, price, quantity, category, photo } = req.body;

  try {
    const product = await getProductById(productId);
    const productTitle = await getProductByTitle(title);

    if (!product) {
      res.send({
        error: "ERROR",
        message: `Product ${productId} not found`,
        title: "ProductNotFound",
      });
    } else if (productTitle && productTitle.title === title) {
      res.send({
        error: "ERROR",
        message: `An Product with  ${title} already exists`,
        title: "ProductAlreadyExists",
      });
    } else {
      const updatedProduct = await updateProduct({
        id: productId,
        title: title,
        description: description,
      });
      res.send(updatedProduct);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/categories/:category", async (req, res, next) => {
  const { category } = req.params;
  try {
    const product = await getProductsByCategory(category);
    res.send(product);
  } catch (error) {
    next(error);
  }
});

export default router;

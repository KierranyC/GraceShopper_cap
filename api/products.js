import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByTitle,
  getProductsByCategory,
  updateProduct,
  getProductsBySearch,
<<<<<<< HEAD
  deleteProduct
=======
  getFeaturedProducts,
>>>>>>> 4cdb0bd6d7a692658957fcda48620e2c4462bfbd
} from "../db/models/products.js";
import { requireAuthentication, requireAdminAuthorization } from "./utils.js";
const router = express.Router();

router.post("/", requireAuthentication, requireAdminAuthorization, async (req, res, next) => {


  const { title, description, price, quantity, category, photo } = req.body;
  try {
    const newProduct = await createProduct({
      title,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      photo,
    });
    console.log('NEW PRODUCT', newProduct)
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

// router.get("/:productId", async (req, res, next) => {
//   const { productId } = req.params;
//   console.log(productId)
//   try {
//     const product = await getProductById(productId);

//     if (product) {
//       res.send(product);
//     } else {
//       res.status(404).send({
//         error: "ERROR",
//         message: `Product ${productId} not found`,
//         title: "productNotFound",
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching product:", error);
//     res.status(500).send({
//       error: "ERROR",
//       message: "Internal server error while fetching product",
//       title: "internalServerError",
//     });
//   }
// });

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
  console.log('CATEGORY:', category)
  try {
    const products = await getProductsByCategory(category);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', requireAuthentication, requireAdminAuthorization, async (req, res, next) => {
  const { productId } = req.body;
  console.log(productId)
  try {
    const updatedProducts = await deleteProduct(productId)
    // console.log(updatedProducts)
    res.send(updatedProducts)
  } catch (error) {
    next(error)
  }
})
router.get("/featured", async (req, res, next) => {
  try {
    const featuredProducts = await getFeaturedProducts();
    res.send(featuredProducts);
  } catch (error) {
    next(error);
  }
});

export default router;

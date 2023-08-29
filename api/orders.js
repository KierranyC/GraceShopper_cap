import express from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrderByUserId,
  updateOrder,
  updateQuantity,
} from "../db/models/orders.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders = getAllOrders();
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, send) => {
  const newOrder = req.body;

  try {
    const createdOrder = await createOrder(newOrder);
    res.send(createdOrder);
  } catch (error) {
    next(error);
  }
});

router.get("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await getOrderById(orderId);
    if (order) {
      res.send(order);
    } else {
      res.send({
        error: "ERROR",
        title: "OrderNotFound",
        message: `order ${orderId} not found.`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;

  try {
    const order = await getOrderByUserId(userId);
    if (order) {
      res.send(order);
    } else {
      res.send({
        error: "ERROR",
        title: "OrderNotFoundWithUserId",
        message: `${userId}'s order not found.`,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:orderId", async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus, quantity } = req.body;

  try {
    const updatedOrder = await updateOrder({
      id: orderId,
      orderStatus: orderStatus,
      quantity: quantity,
    });
    res.send(updatedOrder);
  } catch (error) {
    next(error);
  }
});

router.patch("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const updateProductQuantity = await updateQuantity(productId, quantity);
    res.send(updateProductQuantity);
  } catch (error) {
    next(error);
  }
});

export default router;

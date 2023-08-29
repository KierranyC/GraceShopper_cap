import express from "express";
import {
  createReview,
  getReviewByUserId,
  getReviewByProductId,
} from "../db/models/reviews.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { userId, productId, body } = req.body;
  try {
    const review = createReview({ userId, productId, body });
    res.send(review);
  } catch (error) {
    next(error);
  }
});

router.get("/userId", async (req, res, next) => {
  const { userId } = req.body;
  try {
    const reviews = getReviewByUserId(userId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  const { productId } = req.body;
  try {
    const reviews = getReviewByProductId(productId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

export default router;

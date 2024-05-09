import express from "express";
import {
  createReview,
  getReviewByUserId,
  getReviewByProductId,
} from "../db/models/reviews.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { userId, productId, body } = req.body;
  try {
    const review = await createReview({ userId, productId, body });
    res.send(review);
  } catch (error) {
    next(error);
  }
});

router.get("/userId", async (req, res, next) => {
  const { userId } = req.body;
  try {
    const reviews = await getReviewByUserId(userId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  const { productId } = req.body;
  try {
    const reviews = await getReviewByProductId(productId);
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

export default router;

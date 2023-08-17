const express = require("express");
const {
    createReview,
    getReviewByUserId,
    getReviewByProductId
} = require("../db/models");
const router = express.Router();

router.get("/reviews", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.post("/reviews", async (req, res, next) => {
    const {userId, productId, body} = req.body;
    try {
        const review = createReview({userId, productId, body});
        res.send(review);
    } catch (error) {
      next(error);
    }
  });
  
  router.get("/reviews/userId", async (req, res, next) => {
    const {userId}= req.body;
    try {
        const reviews = getReviewByUserId(userId);
        res.send(reviews);
    } catch (error) {
      next(error);
    }
  });

  router.get("/reviews/:productId", async (req, res, next) => {
    const {productId} = req.body;
    try {
        const reviews = getReviewByProductId(productId);
        res.send(reviews);
    } catch (error) {
      next(error);
    }
  });
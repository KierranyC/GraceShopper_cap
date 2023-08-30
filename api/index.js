import express from "express";

const apiRouter = express.Router();

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here

import usersRouter from "./users.js";
apiRouter.use("/users", usersRouter);

import productsRouter from "./products.js";
apiRouter.use("/products", productsRouter);

import ordersRouter from "./orders.js";
apiRouter.use("/orders", ordersRouter);

import reviewsRouter from "./reviews.js";
apiRouter.use("/reviews", reviewsRouter);

export default apiRouter;

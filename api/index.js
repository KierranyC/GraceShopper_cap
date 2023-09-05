import express from "express";
import usersRouter from "./users.js";
import productsRouter from "./products.js";
import ordersRouter from "./orders.js";
import reviewsRouter from "./reviews.js";

const apiRouter = express.Router();

apiRouter.get("/health", (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here
apiRouter.use("/users", usersRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/reviews", reviewsRouter);

import cartRouter from "./cart.js";
apiRouter.use('/cart', cartRouter);

export default apiRouter;

const router = require('express').Router();

router.get('/health', (req, res, next) => {
  res.send({
    healthy: true,
  });
});

// place your routers here

const usersRouter = require("./users");
router.use("/users", usersRouter);

const productsRouter = require("./products");
router.use("/products", productsRouter);

const ordersRouter = require("./orders");
router.use("/orders", ordersRouter);

const reviewsRouter = require("./reviews");
router.use("/reviews", reviewsRouter);

module.exports = router;

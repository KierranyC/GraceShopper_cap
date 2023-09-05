import express from 'express';
import {
  createCartItem,
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  createGuestCart,
  createUserCart,
  getUserCartItems
} from "../db/models/cart.js";
import requireAuthentication from './utils.js';
const router = express.Router();

router.get('/', requireAuthentication, async (req, res, next) => {
  // console.log('REQUEST GUEST CART:', req.user)
  let userId;

  if (req.user.sessionId) {
    userId = null
  } else {
    userId = req.user.id;
  }

  try {
    const cart = await getUserCart(userId, req.user.sessionId)
    // console.log(cart)
    res.send(cart)
  } catch (error) {
    next(error)
  }
})


router.post('/user', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const cart = await createUserCart({ userId });
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

router.post('/guest', requireAuthentication, async (req, res, next) => {
  // console.log('REQUEST USER POST GUEST ROUTE:', req.user)
  let userId;

  if (req.user.sessionId) {
    userId = null
  } else {
    userId = req.user.id;
  }

  try {
    const cart = await getUserCart(userId, req.user.sessionId)
    // console.log('EXISTING GUEST CART:', cart)
    if (cart.length > 0) {
      res.send(cart)
    } else {
      const newCart = await createGuestCart({ userId: req.user.sessionId });
      // console.log('NEW GUEST USER CART:', newCart)
      res.send(newCart)
    }
  } catch (error) {
    next(error);
  }
});


router.post('/create', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id || req.user;
  const { productId, quantity } = req.body;
  try {
    const newCart = await createCartItem({ userId, productId, quantity });
    // console.log(newCart)
    res.send({ message: "Item added!" })
  } catch (error) {
    next(error);
  }
});

router.post('/add', requireAuthentication, async (req, res, next) => {
  console.log('REQUEST LOGGED IN USER ADD:', req.user)
  let userId;

  if (req.user.sessionId) {
    userId = null
  } else {
    userId = req.user.id;
  }

  const { productId, quantity } = req.body;

  try {
    const existingCart = await getUserCart(userId, req.user.sessionId);
    // console.log('EXISTING CART:', existingCart)
    if (existingCart.length === 0) {
      const initializedCart = await createCartItem({
        userId: userId,
        guestId: req.user.sessionId,
        productId,
        quantity,
      });
      console.log('INITIALIZED CART:', initializedCart)
      res.send(initializedCart);
    } else {
      const checkForProductInCart = existingCart.some((product) => product.productId === productId);
      console.log(checkForProductInCart)
      if (!checkForProductInCart) {
        const updatedCart = await addToCart({
          userId: userId,
          guestId: req.user.sessionId,
          productId,
          quantity,
        });
        console.log('UPDATED CART:', updatedCart)
        res.send(updatedCart);
      } else {
        // Product is already in the cart; you can send a message or status code here if needed.
        res.status(400).send({ message: 'Product is already in the cart.' });
      }
    }
  } catch (error) {
    next(error);
  }
});


router.patch('/update', requireAuthentication, async (req, res, next) => {

  let userId;

  if (req.user.sessionId) {
    userId = null;
  } else {
    userId = req.user.id;
  }

  const { productId, quantity } = req.body;

  try {
    const existingCart = await getUserCart(userId, req.user.sessionId);

    const existingCartItem = existingCart.find((product) => product.productId === productId);

    if (existingCartItem) {
      // If the product exists in the cart, update its quantity
      const updatedCart = await updateCartItemQuantity({
        userId,
        guestId: req.user.sessionId, // Pass guestId for guests
        productId,
        quantity,
      });
      console.log("UPDATED CART API ROUTE", updatedCart);
      res.send(updatedCart);
    }
  } catch (error) {
    next(error);
  }
});


router.delete('/remove', requireAuthentication, async (req, res, next) => {
  let userId;

  if (req.user.sessionId) {
    userId = null;
  } else {
    userId = req.user.id;
  }

  const { productId } = req.body;

  try {
    const updatedCart = await removeFromCart(userId, req.user.sessionId, productId);
    console.log('UPDATED CART REMOVE ITEM ROUTE:', updatedCart);
    res.send(updatedCart);
  } catch (error) {
    next(error);
  }
});


export default router;
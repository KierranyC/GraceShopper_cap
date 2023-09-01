import express from 'express';
import {
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../db/models/cart.js";
import requireAuthentication from './utils.js';
const router = express.Router();

router.get('/', requireAuthentication, async (req, res, next) => {
  console.log(req.user)
  const userId = req.user.id;

  try {
    const cart = await getUserCart(userId)
    res.send(cart)
  } catch (error) {
    next(error)
  }
})

router.post('/add', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id
  const { productId, quantity } = req.body

  try {
    const addItem = await addToCart(userId, productId, quantity)
    res.send(addItem)
  } catch (error) {
    next(error)
  }
})

router.patch('/update', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const updatedCart = await updateCartItemQuantity(userId, productId, quantity)
    res.send(updatedCart)
  } catch (error) {
    next(error)
  }
})

router.delete('/remove', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    await removeFromCart(userId, productId)
    res.send({ message: 'item removed from cart' })
  } catch (error) {
    next(error)
  }
})

export default router;
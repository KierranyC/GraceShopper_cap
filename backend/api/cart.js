import express from 'express';
import {
  createCartItem,
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  createGuestCart,
  createUserCart,
  getUserCartItems,
  updateGuestToUserCart,
  clearUserCart
} from "../db/models/cart.js";
import { requireAuthentication } from './utils.js';
import Stripe from "stripe";
import { createOrderItem, createOrder } from '../db/models/orders.js';
import zlib from 'zlib';
const stripe = new Stripe('sk_test_51NyLPaIBy4kJpJhvcJi6rNo2t1dYH2G6E6NZlraMTMRc4QtWkS3soLW5bZnTWJddjGZpx9q2I4bg9UjaUKGzG8uK00PsNGohtJ');
const router = express.Router();
const YOUR_DOMAIN = 'http://localhost:4000';


router.get('/', requireAuthentication, async (req, res, next) => {
  // console.log('GET CART ROUTE:', req.user)
  let userId;

  if (req.user.sessionId) {
    userId = null
  } else {
    userId = req.user.id;
  }

  try {
    const cart = await getUserCart(userId, req.user.sessionId)
    console.log('USER CART:', cart)
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
      res.send(updatedCart);
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/updateuser', requireAuthentication, async (req, res, next) => {
  console.log('CART OWNER UPDATE ROUTE REQ USER:', req.user)
  const { guestId } = req.body;
  console.log('GUEST ID UPDATE CART ROUTE CHECK:', guestId)
  try {
    const updatedCart = await updateGuestToUserCart(req.user.id, guestId)
    res.send(updatedCart)
  } catch (error) {
    next(error)
  }

})


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


router.post("/checkout-session", async (req, res) => {
  const { cartItems, userId } = req.body; // Get the cart items from the request body
  console.log('CART CHECKOUT ROUTE:', cartItems)
  console.log('USER ID CHECKOUT ROUTE:', userId)

  // const modifiedCartItems = cartItems.map(item => {
  //   return {
  //     productId: item.productId,
  //     quantity: item.quantity,
  //     title: item.productInfo.title,
  //     description: item.productInfo.description,
  //     photo: item.productInfo.photo,
  //     price: item.productInfo.price
  //   }
  // })
  // console.log('MODIFIED CART ITEMS:', modifiedCartItems)
  const customer = await stripe.customers.create({
    metadata: {
      userId: userId
    }
  })
  // const cartItemsString = JSON.stringify(cartItems);
  try {

    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productInfo.title,
            images: [item.productInfo.photo],
            description: item.productInfo.description,
            metadata: {
              productId: item.productId
            },
          },
          unit_amount: item.productInfo.price * 100,
        },
        quantity: item.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://oilay.netlify.app/checkout-success`,
      cancel_url: `https://oilay.netlify.app/Cart`
    });

    res.send({ url: session.url })
  } catch (error) {
    res.status(500).json({ error })
  }
});

// Stripe Webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.

// To listen, type stripe listen --forward-to localhost:4000/api/cart/webhook in the command line

let endpointSecret;

// endpointSecret = process.env.WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  console.log('REQUEST HEADERS:', request.headers)
  console.log('REQUEST BODY:', request.body)
  // Verifies that these events are coming from Stripe

  const sig = request.headers['stripe-signature'];
  console.log('STRIPE SIGNATURE', sig)
  let data;
  let eventType;

  if (endpointSecret) {
    console.log('ENDPOINT SECRET:', endpointSecret)
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('EVENT:', event)
      console.log('WEBHOOK VERIFIED.')
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = request.body.data.object;
    eventType = request.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {

    const session = data;
    console.log('SESSION METADATA:', session)

    const items = await stripe.checkout.sessions.listLineItems(
      session.id,
      { expand: ["data.price.product"] }
    )
    console.log("ITEMS:", items)

    const customer = await stripe.customers.retrieve(data.customer)
    console.log('CUSTOMER METADATA:', customer.metadata)



    const order = await createOrder({
      userId: customer.metadata.userId,
      totalAmount: session.amount_total / 100
    })
    console.log('CREATED ORDER:', order)

    for (const item of items.data) {
      console.log('ITEM PRICE OBJECT:', item.price.product.metadata)
      await createOrderItem({
        orderId: order.id,
        productId: item.price.product.metadata.productId,
        quantity: item.quantity,
        itemPrice: parseFloat(parseInt(item.amount_total))
      })
    }

    await clearUserCart({ userId: customer.metadata.userId })


  }
  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});


export default router;
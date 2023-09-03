import express from 'express';
import {
  createCartItem,
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
} from "../db/models/cart.js";
import requireAuthentication from './utils.js';
const router = express.Router();

router.get('/', requireAuthentication, async (req, res, next) => {
  // console.log(req.user)
  const userId = req.user.id || null;

  try {
    const cart = await getUserCart({ userId })
    // console.log(cart)
    res.send(cart)
  } catch (error) {
    next(error)
  }
})

router.post('/create', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const newCart = await createCartItem({ userId, productId, quantity });
    // console.log(newCart)
    res.send({ message: "Item added!" })
  } catch (error) {
    next(error);
  }
});

// router.post('/add', requireAuthentication, async (req, res, next) => {
//   const userId = req.user.id
//   const { productId, quantity } = req.body
//   try {
//     // cart comment: check if cart exists,
//     // if not create a cart item,
//     // and if it does exist add item to cart
//     const existingCart = await getUserCart({ userId });
//     // console.log(existingCart)
//     if (existingCart.length === 0) {
//       const initializedCart = await createCartItem({ userId, productId, quantity });
//       // console.log(initializedCart)
//       res.send(initializedCart);
//     } else {
//       // Check if the product is already in the cart
//       const checkForProductInCart = existingCart.some((product) => product.productId === productId);
//       if (!checkForProductInCart) {
//         const updatedCart = await addToCart({ userId, productId, quantity });
//         // console.log(updatedCart)
//         res.send(updatedCart);
//       }
//     }
//   } catch (error) {
//     next(error)
//   }
// });

router.post('/add', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id || null; // Use null for guests
  const { productId, quantity } = req.body;

  try {
    // cart comment: check if cart exists,
    // if not create a cart item,
    // and if it does exist, add an item to the cart
    const existingCart = await getUserCart({ userId });

    if (existingCart.length === 0) {
      // Use userId or null to create the cart item based on authentication
      const initializedCart = await createCartItem({ userId, productId, quantity });
      res.send(initializedCart);
    } else {
      // Check if the product is already in the cart
      const checkForProductInCart = existingCart.some((product) => product.productId === productId);
      if (!checkForProductInCart) {
        const updatedCart = await addToCart({ userId, productId, quantity });
        res.send(updatedCart);
      }
    }
  } catch (error) {
    next(error);
  }
});


// router.patch('/update', requireAuthentication, async (req, res, next) => {
//   const userId = req.user.id;
//   const { productId, quantity } = req.body;
//   try {
//     const updatedCart = await updateCartItemQuantity({ userId, productId, quantity });
//     console.log("UPDATED CART", updatedCart);
//     if (updatedCart) {
//       res.send(updatedCart);
//     } else {
//       res.status(404).json({ message: 'Item not found in cart' });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

router.patch('/update', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id || null; // Use null for guests
  const { productId, quantityChange, quantity } = req.body;

  try {
    const updatedCart = await updateCartItemQuantity({ userId, productId, quantityChange, quantity });
    console.log("UPDATED CART", updatedCart);
    if (updatedCart) {
      res.send(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    next(error);
  }
});



// router.delete('/remove', requireAuthentication, async (req, res, next) => {
//   const userId = req.user.id;
//   const { productId } = req.body;

//   try {
//     const updatedCart = await removeFromCart({ userId, productId })
//     console.log(updatedCart)
//     res.send(updatedCart)
//   } catch (error) {
//     next(error)
//   }
// })

router.delete('/remove', requireAuthentication, async (req, res, next) => {
  const userId = req.user.id || null; // Use null for guests
  const { productId } = req.body;

  try {
    const updatedCart = await removeFromCart({ userId, productId });
    console.log(updatedCart);
    res.send(updatedCart);
  } catch (error) {
    next(error);
  }
});


export default router;
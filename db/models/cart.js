import client from "../client.js";

async function createCart(userId) {
  try {
    // Insert a new cart for the user into the database
    const { rows: [cart] } = await client.query(
      `
      INSERT INTO cart (user_id)
      VALUES ($1)
      RETURNING *;
      `,
      [userId]
    );

    return cart;
  } catch (error) {
    console.error(error);
  }
}

async function createCartItem({ userId, guestId, productId, quantity }) {
  try {
    const { rows: cartItem } = await client.query(`
    INSERT INTO "cartItems" ("userId", "guestId", "productId", quantity) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [userId, guestId, productId, quantity]);

    return cartItem;
  } catch (error) {
    console.error(error)
  }
}

async function getUserCartItems({ userId }) {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM "cartItems"
      WHERE "userId" = $1;
    `, [userId]);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getProductInfo(productId) {
  try {
    const { rows } = await client.query(`
      SELECT products.title, products.price
      FROM products
      WHERE id = $1;
    `, [productId]);

    return rows[0]; // Assuming that there is only one product with a given ID
  } catch (error) {
    console.error(error);
  }
}

async function getUserCart({ userId }) {
  const cartItems = await getUserCartItems({ userId });

  // Fetch product information for each item in the cart
  const cartWithProductInfo = await Promise.all(cartItems.map(async (cartItem) => {
    const productInfo = await getProductInfo(cartItem.productId);
    return {
      ...cartItem,
      productInfo,
    };
  }));

  return cartWithProductInfo;
}



async function addToCart({ userId, productId, quantity }) {
  try {
    const { rows } = await client.query(`
    INSERT INTO "cartItems" ("userId", "productId", quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [userId, productId, quantity]);

    return rows;
  } catch (error) {
    console.error(error)
  }
}

async function updateCartItemQuantity({ userId, productId, quantity }) {
  try {
    await client.query(`
      UPDATE "cartItems"
      SET quantity = $1
      WHERE "userId" = $2
      AND "productId" = $3;
    `, [quantity, userId, productId]);

    const { rows: updatedCart } = await client.query(`
      SELECT * 
      FROM "cartItems"
      WHERE "userId" = $1;
    `, [userId]);

    return updatedCart;
  } catch (error) {
    console.error(error);
  }
}

async function removeFromCart({ userId, productId }) {
  try {
    await client.query(`
    DELETE FROM "cartItems"
    WHERE "userId" = $1
    AND "productId" = $2;
    `, [userId, productId]);

    const { rows: updatedCart } = await client.query(`
      SELECT * 
      FROM "cartItems"
      WHERE "userId" = $1;
    `, [userId]);

    return updatedCart;
  } catch (error) {
    console.error(error)
  }
}

export {
  createCart,
  createCartItem,
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart
}
import client from "../client.js";

async function getUserCart(userId) {
  try {
    const { rows } = await client.query(`
    SELECT * 
    FROM cart
    WHERE user_id = $1;
    `, [userId]);

    return rows;
  } catch (error) {
    console.error(error)
  }
}

async function addToCart(userId, productId, quantity) {
  try {
    const { rows: [cart] } = await client.query(`
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [userId, productId, quantity]);

    return cart;
  } catch (error) {
    console.error(error)
  }
}

async function updateCartItemQuantity(userId, productId, quantity) {
  try {
    const { rows: [cart] } = await client.query(`
    UPDATE cart
    SET quantity = $1
    WHERE user_id = $2
    AND product_id = $3;
    `, [quantity, userId, productId]);

    return cart;
  } catch (error) {
    console.error(error)
  }
}

async function removeFromCart(userId, productId) {
  try {
    const { rows: [cart] } = await client.query(`
    DELETE FROM cart 
    WHERE user_id = $1
    AND product_id = $2;
    `[userId, productId]);

    return cart;
  } catch (error) {
    console.error(error)
  }
}

export {
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart
}
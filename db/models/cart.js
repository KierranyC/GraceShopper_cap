import client from "../client.js";


async function createGuestCart({ userId }) {
  try {
    const { rows: cart } = await client.query(
      `
      INSERT INTO "cartItems" ("guestId")
      VALUES ($1)
      RETURNING *;
      `,
      [userId]
    );
    console.log(cart)
    return cart;
  } catch (error) {
    console.error(error);
  }
}

async function createUserCart({ userId }) {
  try {
    const { rows: cart } = await client.query(
      `
      INSERT INTO "cartItems" ("userId")
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
    const { rows } = await client.query(`
      INSERT INTO "cartItems" ("userId", "guestId", "productId", quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [typeof userId === 'number' ? userId : null, typeof guestId === 'string' ? guestId : null, productId, quantity]);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getUserCartItems(condition, values) {
  try {
    const { rows } = await client.query(
      `SELECT *
       FROM "cartItems"
       WHERE ${condition};`,
      values
    );

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

    return rows[0];
  } catch (error) {
    console.error(error);
  }
}


async function getUserCart(userId, guestId) {
  try {
    let cartItems;

    if (userId !== null) {
      const condition = `"userId" = $1`;
      cartItems = await getUserCartItems(condition, [userId]);
    } else {
      const condition = `"guestId" = $1`;
      cartItems = await getUserCartItems(condition, [guestId]);
    }

    const cartWithProductInfo = await Promise.all(cartItems.map(async (cartItem) => {
      const productInfo = await getProductInfo(cartItem.productId);
      return {
        ...cartItem,
        productInfo,
      };
    }));

    return cartWithProductInfo;
  } catch (error) {
    console.error(error);
  }
}



async function addToCart({ userId, guestId, productId, quantity }) {
  try {
    await client.query(`
      INSERT INTO "cartItems" ("userId", "guestId", "productId", quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [typeof userId === 'number' ? userId : null, typeof guestId === 'string' ? guestId : null, productId, quantity]);

    const { rows: matchingRows } = await client.query(
      `
      SELECT * FROM "cartItems"
      WHERE "userId" = $1 OR "guestId" = $2;
      `,
      [userId, guestId]
    );

    console.log(matchingRows);
    return matchingRows;
  } catch (error) {
    console.error(error)
  }
}


async function updateCartItemQuantity({ userId, guestId, productId, quantity }) {
  try {
    const condition = userId ? `"userId"` : `"guestId"`;
    const values = userId ? [userId, productId, quantity] : [guestId, productId, quantity];

    const { rows: updatedCart } = await client.query(`
      UPDATE "cartItems" 
      SET quantity = $3
      WHERE ${condition} = $1 AND "productId" = $2
      RETURNING *;
    `, values);

    console.log('UPDATED CART DB FUNC:', updatedCart)
    return updatedCart;
  } catch (error) {
    console.error(error);
  }
}

async function removeFromCart(userId, guestId, productId) {
  try {
    const condition = userId ? `"userId"` : `"guestId"`;
    const values = userId ? [userId, productId] : [guestId, productId];

    await client.query(`
      DELETE FROM "cartItems" 
      WHERE ${condition} = $1 AND "productId" = $2;
    `, values);

    const updatedCart = await getUserCart(userId, guestId);
    console.log('REMOVE ITEM DB FUNCTION UPDATED CART:', updatedCart)
    return updatedCart;
  } catch (error) {
    console.error(error);
  }
}


export {
  createGuestCart,
  createUserCart,
  createCartItem,
  getUserCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  getUserCartItems
}
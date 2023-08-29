import client from "../client.js";
async function createOrder({ userId, productId }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            INSERT INTO orders( "userId", "productId" )
            VALUES($1, $2)
            RETURNING *;
        `,
      [userId, productId]
    );

    return order;
  } catch (error) {
    console.error(error);
  }
}

async function getOrderById(orderId) {
  try {
    const {
      rows: [order],
    } = await client.query(`
            SELECT *
            FROM orders
            WHERE id=${orderId};
        `);

    return order;
  } catch (error) {
    console.error(error);
  }
}

async function getAllOrders() {
  try {
    const { rows: allOrders } = await client.query(`
            SELECT *
            FROM orders;
        `);
    const orders = await Promise.all(
      allOrders.map((order) => getOrderByUserId(order.id))
    );
    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function getOrderByProductId({ productId }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            SELECT *
            FROM orders
            WHERE "productId"=$1;
        `,
      [productId]
    );

    return order;
  } catch (error) {
    console.error(error);
  }
}

async function getOrderByUsername({ username }) {
  try {
    const {
      rows: [users],
    } = await client.query(
      `
      SELECT id 
      FROM users
      WHERE username = ${username};
      `);

    const {
      rows: [orders],
    } = await client.query(`
      SELECT username
      FROM users
      JOIN orders ON users.id = orders."userId"
      WHERE orders."userId"= ${users.id};
      `);
    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function updateOrder(userId, productId, productQuantity, orderStatus) {
  try {
    const {
      rows: [updatedOrder],
    } = await client.query(
      `
            UPDATE orders
            SET "productQuantity"=$1, "orderStatus"=$2
            WHERE "userId"=$3 AND "productId"=$4
            RETURNING *;
        `,
      [userId, productId, productQuantity, orderStatus]
    );
    return updatedOrder;
  } catch (error) {
    console.error(error);
  }
}

async function updateQuantity(productId, quantity, ...fields) {
  try {
    const string = fields
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const {
      rows: [quantity],
    } = await client.query(
      `
            UPDATE quantity
            SET ${string}
            WHERE "productId=$${fields.length + 1}
            RETURNING *;
        `,
      Object.values(fields)
    );

    return quantity;
  } catch (error) {
    console.error(error);
  }
}

export {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrderByProductId,
    getOrderByUserId,
    updateOrder,
    updateQuantity
  };
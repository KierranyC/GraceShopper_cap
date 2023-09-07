import client from "../client.js";
async function createOrder({ userId, guestId, date, totalAmount, orderStatus }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            INSERT INTO orders( "userId", "guestId", date, "totalAmount", "orderStatus" )
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `,
      [userId, guestId, date, totalAmount, orderStatus]
    );

    return order;
  } catch (error) {
    console.error(error);
  }
}

async function createOrderItem({ orderId, productId, quantity, itemPrice }) {
  try {
    const { rows: [orderItem] } = await client.query(`
    INSERT INTO "orderItems"("orderId", "productId", quantity, "itemPrice") 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `[orderId, productId, quantity, itemPrice]);

    return orderItem;
  } catch (error) {
    console.error(error)
  }
}

async function getOrderById(orderId) {
  try {
    const {
      rows: [order]
    } = await client.query(`
            SELECT *
            FROM orders
            WHERE id=${orderId};
        `);

    const { rows: orderItems } = await client.query(`
    SELECT * 
    FROM "orderItems"
    WHERE "orderId"=${orderId};
    `)

    order.items = orderItems.filter(item => {
      item.orderId === order.id
    })

    return order;
  } catch (error) {
    console.error(error);
  }
}

async function getAllOrders() {
  try {
    const { rows: ids } = await client.query(`
            SELECT id
            FROM orders;
        `);
    const orders = await Promise.all(
      ids.map((order) => getOrderById(order.id))
    );
    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersByProductId({ productId }) {
  try {
    const {
      rows: ids,
    } = await client.query(
      `
            SELECT id
            FROM orders
            WHERE "productId"=$1;
        `,
      [productId]
    );

    const orders = await Promise.all(
      ids.map((order) => getOrderById(order.id)))

    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersByUsername({ username }) {
  try {
    // const {
    //   rows: [users],
    // } = await client.query(
    //   `
    //   SELECT id 
    //   FROM users
    //   WHERE username = ${username};
    //   `);

    // const {
    //   rows: [orders],
    // } = await client.query(`
    //   SELECT username
    //   FROM users
    //   JOIN orders ON users.id = orders."userId"
    //   WHERE orders."userId"= ${users.id};
    //   `);

    const { rows: ids } = await client.query(`
    SELECT orders.id
    FROM orders
    JOIN users ON orders."userId" = users.id
    WHERE users.username = $1;
    `, [username]);

    const orders = await Promise.all(
      ids.map((order) => getOrderById(order.id)))

    return orders;
  } catch (error) {
    console.error(error);
  }
}

async function getOrdersByGuestId({ guestId }) {
  try {
    const { rows: ids } = await client.query(`
    SELECT orders.id
    FROM orders
    WHERE "guestId" = $1;
    `, [guestId]);

    const orders = await Promise.all(
      ids.map((order) => getOrderById(order.id)))

    return orders;
  } catch (error) {
    console.error(error)
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
  createOrderItem,
  getOrderById,
  getOrdersByGuestId,
  getAllOrders,
  getOrdersByProductId,
  getOrdersByUsername,
  updateOrder,
  updateQuantity
};
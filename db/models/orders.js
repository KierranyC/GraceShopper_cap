import client from "../client.js";
import { getProductInfo } from "./cart.js";

async function createOrder({ userId, date, totalAmount, orderStatus }) {
  try {
    const {
      rows: [order],
    } = await client.query(
      `
            INSERT INTO orders( "userId", date, "totalAmount", "orderStatus" )
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `,
      [userId, date, totalAmount, orderStatus]
    );

    return order;
  } catch (error) {
    console.error(error);
  }
}

async function createOrderItem({ orderId, productId, quantity, itemPrice }) {
  console.log('ORDER ID:', orderId)
  console.log('PRODUCT ID:', productId)
  console.log('QUANTITY:', quantity)
  console.log('ITEM PRICE:', itemPrice)
  try {
    const { rows: [orderItem] } = await client.query(`
    INSERT INTO "orderItems"("orderId", "productId", quantity, price) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [orderId, productId, quantity, itemPrice]);

    console.log('ORDER ITEM IN DB:', orderItem)
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
            WHERE id=$1;
        `, [orderId]);

    const { rows: orderItems } = await client.query(`
    SELECT * 
    FROM "orderItems"
    WHERE "orderId"=$1;
    `, [orderId]);

    order.items = await Promise.all(orderItems.map(async (item) => {
      item.productInfo = await getProductInfo(item.productId);
      return item;
    }));
    console.log('ORDER ITEMS:', order.items)
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
  console.log('GETORDERSBYUSERNAME USERNAME:', username)
  try {
    const { rows: ids } = await client.query(`
    SELECT orders.id
    FROM orders
    JOIN users ON orders."userId" = users.id
    WHERE users.username = $1;
    `, [username]);

    const orders = await Promise.all(
      ids.map((order) => getOrderById(order.id)))

    console.log('GETORDERSBYUSERNAME ORDERS:', orders)
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
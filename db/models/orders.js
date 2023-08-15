const client = require("../client");

async function createOrder({ userId, productId }) {
    try {
        const { rows: [order] } = await client.query(`
            INSERT INTO orders( "userId", "productId" )
            VALUES($1, $2)
            RETURNING *;
        `, [userId, productId]);

        return order;
    }   catch(error) {
        console.error(error);
    }
};

async function getOrderById(orderId) {
    try {
        const { rows: [order] } = await client.query(`
            SELECT *
            FROM orders
            WHERE id=${orderId};
        `);

        return order;
    }   catch(error) {
        console.error(error);
    }
};

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
    }   catch(error) {
        console.error(error)
    }
};

async function getOrderByProductId({ productId }) {
    try {
        const { rows: [order] } = await client.query(`
            SELECT *
            FROM orders
            WHERE "productId"=$1;
        `, [productId]);

        return order;
    }   catch(error) {
        console.error(error);
    }
};

async function getOrderByUserId({ userId }) {
    try {
        const { rows: [order] } = await client.query(`
            SELECT *
            FROM orders
            WHERE "userId"=$1;
        `, [userId]);
      
        return order;
    }   catch(error) {
        console.error(error);
    }
};

module.exports = {
    createOrder,
    getOrderById,
    getAllOrders,
    getOrderByProductId,
    getOrderByUserId
};
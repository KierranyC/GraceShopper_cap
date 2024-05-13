import client from "../client.js";

async function createReview({ userId, productId, body }) {
    try {
        const { rows: [review] } = await client.query(`
            INSERT INTO reviews( "userId", "productId", body )
            VALUES($1, $2, $3)
            RETURNING *;
        `, [userId, productId, body]);

        return review;
    }   catch(error) {
        console.error(error);
    }
};

async function getReviewByUserId({ userId }) {
    try {
        const { rows: [review] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE "userId"=$1;
        `, [userId]);
      
        return review;
    }   catch(error) {
        console.error(error);
    }
};

async function getReviewByProductId({ productId }) {
    try{
        const { rows: [review] } = await client.query(`
            SELECT *
            FROM reviews
            WHERE "productId"=$1;
        `, [productId]);

        return review;
    }   catch(error) {
        console.error(error);
    }
};

export {
    createReview,
    getReviewByUserId,
    getReviewByProductId
  };
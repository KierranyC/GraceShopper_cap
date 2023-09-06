// grab our db client connection to use with our adapters
import client from "../client.js";
import bcrypt from "bcrypt";

const SALT_COUNT = 10;

async function createUser({ email, username, password, isAdmin }) {
  // create new user, stores their hashed password in the db,
  // returns the user without the password
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
   INSERT INTO users(email, username, password, "isAdmin")
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (username) DO NOTHING
   RETURNING *;
    `,
      [email, username, hashedPassword, isAdmin]
    );
    delete user.password;

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function createGuest(sessionId) {
  try {
    const {
      rows: [guest],
    } = await client.query(
      `
    INSERT INTO guests("sessionId")
    VALUES ($1)
    RETURNING "sessionId";
    `,
      [sessionId]
    );

    return guest;
  } catch (error) {
    console.error(error);
  }
}

// async function findGuestBySessionId(guestSessionId) {
//   try {
//     const { rows: [guest] } = await client.query(`
//     SELECT *
//     FROM guests
//     WHERE "sessionId" = $1;
//     `, [guestSessionId]);

//     return guest
//   } catch (error) {
//     console.error(error)
//   }
// }

async function findGuestBySessionId(sessionId) {
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM guests
      WHERE "sessionId" = $1;
    `,
      [sessionId]
    );

    if (rows.length === 0) {
      // Handle the case where no guest is found with the provided sessionId
      return null;
    }

    // Return the guest information
    return rows[0];
  } catch (error) {
    console.error(error);
  }
}

async function getAllUsers() {
  /* this adapter should fetch a list of users from your db */
  try {
    const { rows } = await client.query(`
    SELECT id, username, email, "isAdmin"
    FROM users;
    `);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getAllGuests() {
  /* this adapter should fetch a list of users from your db */
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM guests;
    `);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

async function getUserById(userId) {
  // returns a user with an id that matches the passed
  // in user id
  try {
    const {
      rows: [user],
    } = await client.query(`
    SELECT *
    FROM users
    WHERE id = ${userId}
    `);

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUser({ username, password }) {
  // verifies if a password that is used during login
  // matches the password that is already saved with the
  // username in the db
  const user = await getUserByUsername(username);
  // console.log(user);
  const hashedPassword = user.password;

  const isValid = await bcrypt.compare(password, hashedPassword);
  if (!isValid) {
    return false;
  } else {
    delete user.password;
    return user;
  }
}

async function getUserByUsername(username) {
  // returns a user with a username that matches
  // the passed in username
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT * 
    FROM users
    WHERE username = $1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  const hashedPassword = await bcrypt.hash(fields.password, SALT_COUNT);
  fields.password = hashedPassword;

  try {
    const string = Object.keys(fields)
      .map(
        (key, index) =>
          `"${key}" = $${index + 1}
  `
      )
      .join(", ");

    const {
      rows: [user],
    } = await client.query(
      `
    UPDATE users
    SET ${string} 
    WHERE id=${id}
    RETURNING *;
  `,
      Object.values(fields)
    );
    return user;
  } catch (err) {
    console.error(err);
  }
}

async function deleteUser(id) {

  try {
    await client.query(`
    DELETE FROM orders
    WHERE "userId"=${id};
    `);
    await client.query(`
    DELETE FROM users
    WHERE users.id=${id};
    `);

    await client.query(`
    DELETE FROM "cartItems"
    WHERE "userId"=$1;
    `, [id]);

    const { rows: updatedUsers } = await client.query(`
    SELECT id, email, username, "isAdmin"
    FROM users;
    `);

    return updatedUsers
  } catch (error) {
    console.error(error);
  }
}

async function deleteGuest(sessionId) {
  console.log(sessionId)
  try {
    // await client.query(`
    // DELETE FROM orders
    // WHERE "guestId"=$1;
    // `, [sessionId]);
    await client.query(`
    DELETE FROM guests
    WHERE "sessionId"=$1;
    `, [sessionId]);

    await client.query(`
    DELETE FROM "cartItems"
    WHERE "guestId"=$1;
    `, [sessionId]);

    const { rows: updatedGuests } = await client.query(`
    SELECT *
    FROM guests;
    `);

    return updatedGuests;
  } catch (error) {
    console.error(error);
  }
}

export {
  createUser,
  createGuest,
  findGuestBySessionId,
  getAllUsers,
  getUserById,
  getUser,
  getUserByUsername,
  updateUser,
  getAllGuests,
  deleteUser,
  deleteGuest
};

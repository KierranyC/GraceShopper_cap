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

async function getAllUsers() {
  /* this adapter should fetch a list of users from your db */
  try {
    const { rows } = await client.query(`
    SELECT * 
    FROM users;
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
    SELECT id, username, password
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
  console.log(user);
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
  }
}

async function updateUser({ id, ...fields }) {
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

export { createUser, getAllUsers, getUserById, getUser, getUserByUsername };

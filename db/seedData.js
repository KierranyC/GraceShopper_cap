const client = require("./client");

async function createTables() {
  console.log("Starting to build tables...");
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        "isAdmin" BOOLEAN DEFAULT false
      );
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        category VARCHAR(255) NOT NULL,
        photo BYTEA
      );
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),        
        "productId" INTEGER REFERENCES products(id)
      );
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id),
        "productId" INTEGER REFERENCES products(id),
        body TEXT NOT NULL
      );
      `);
    console.log("Tables Created!");
  } catch (error) {
    console.log("Error creating tables");
    throw error;
  }
}

async function dropTables() {
  console.log("Dropping All Tables...");
  try {
    await client.query(`
    DROP TABLE IF EXISTS reviews CASCADE;
    DROP TABLE IF EXISTS orders CASCADE;
    DROP TABLE IF EXISTS products CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log("Tables Dropped!");
  } catch (error) {
    console.log("Error droping tables");
    throw error;
  }
}

async function rebuildDB() {
  try {
    await dropTables();
    await createTables();
    //add in crate intial stuff for testing when avalible
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
  dropTables,
  createTables,
};

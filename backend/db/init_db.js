import client from "./client.js";
import { products, user, orders, reviews } from "./models/index.js";
import {
  dropTables,
  createTables,
  createInitialUsers,
  createInitialProducts,
  createInitialOrders,
} from "./seedData.js";

async function buildTables() {
  try {
    client.connect();
    await dropTables();
    // drop tables in correct order
    await createTables();
    // build tables in correct order
  } catch (error) {
    throw error;
  }
}

async function populateInitialData() {
  try {
    // create useful starting data by leveraging your
    // Model.method() adapters to seed your db, for example:
    // const user1 = await User.createUser({ ...user info goes here... })
    await createInitialUsers();
    await createInitialProducts();
    await createInitialOrders();
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());

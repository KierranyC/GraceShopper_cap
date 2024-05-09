import client from "./client.js";
import { rebuildDB } from './seedData.js';

client
  .connect()
  .then(rebuildDB)
  .catch(console.error)
  .finally(async () => {
    try {
      await client.end();
    } catch (error) {
      console.error(error);
    }
  });
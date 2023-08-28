import client from './client';
import { rebuildDB } from './seedData';

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
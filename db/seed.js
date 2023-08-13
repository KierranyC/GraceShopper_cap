const client = require('./client');
const { rebuildDB } = require('./seedData');

// rebuildDB()
//   .catch(console.error)
//   .finally(() => client.end());
client
.connect()
.then(rebuildDB)
.catch(console.error)
.finally(() => client.end());

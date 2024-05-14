// Connect to DB
import { config as dotenvConfig } from "dotenv";
import pg from "pg";

dotenvConfig();
const { Client } = pg;

const DB_URL =
  process.env.DATABASE_URL

let client;

// github actions client config
// if (process.env.CI) {
//   client = new Client({
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: "postgres",
//     database: "postgres",
//   });
// } else {
//   // local / heroku client config
//   client = new Client(DB_URL);
// }

// Check if running in Heroku environment
if (DB_URL) {
  // Heroku environment

  client = new Client({
    connectionString: DB_URL,
    ssl: {
      // rejectUnauthorized: false // This is to allow self-signed certificates on Heroku PostgreSQL
      require: true,
      ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString()
    }
  });
} else {
  // Local environment
  client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "postgres",
  });
}



export default client;

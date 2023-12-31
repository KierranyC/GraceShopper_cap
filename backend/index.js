import dotenv from "dotenv";
dotenv.config();
// console.log('ENV VARS:', process.env)
import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRouter from "./api/index.js";
import path from "path";
import client from "./db/client.js";
// import { admin, adminRouter } from './App.js';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51NioUWB9h1tasC0ynwIfN6UfPnghz51GPnbWtbY5flyQZJ1x6yV0Rrcw1fE570OjqlNYCLBu6h1alrxWG5dAARU900mhyvNpTz')


// This is the Web Server
const server = express();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// server.use(cors()); // Enable CORS first
// server.use(cors({
//   origin: "https://oilay.netlify.app",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, // Allow credentials (cookies, HTTP authentication) to be sent
// }));
server.use(cors({
  origin: 'https://oilay.netlify.app', // use your actual domain name (or localhost), using * is not recommended
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Origin', 'x-guest-session-id', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
  credentials: true
}))

server.use(morgan("dev")); // Logging
server.use(express.json()); // JSON parsing

// server.use("/static", express.static(path.join(__dirname, "./build"))); // Static files

// here's our API
server.use("/api", apiRouter);

// adminJs
// server.use("admin", adminRouter)

// // by default serve up the react app if we don't recognize the route
// server.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "./build", "index.html"));
// });

// connect to the server
const PORT = process.env.PORT || 4000;

// define a server handle to close open tcp connection after unit tests have run
const handle = server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);

  try {
    await client.connect();
    console.log("Database is open for business!");
  } catch (error) {
    console.error("Database is closed for repairs!\n", error);
  }
});

// export server and handle for routes/*.test.js
export { server, handle };

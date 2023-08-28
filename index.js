// This is the Web Server
import dotenv from "dotenv";
import express from "express";
const server = express();

// enable cross-origin resource sharing to proxy api requests
// from localhost:3000 to localhost:4000 in local dev env
import cors from "cors";
server.use(cors());

// create logs for everything
import morgan from "morgan";
server.use(morgan("dev"));

// handle application/json requests
server.use(express.json());

server.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "favicon.ico"));
});

// here's our static files
const __dirname = path.dirname(new URL(import.meta.url).pathname);
import path from "path";
server.use("/static", express.static(path.join(__dirname, "build")));

// here's our API
import { Router } from "express";
const router = Router();
import apiRouter from "./api/index.js";
router.use("/products", apiRouter);
server.use("/api", apiRouter);

// by default serve up the react app if we don't recognize the route
server.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// bring in the DB connection
import client from "./db/client.js";

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

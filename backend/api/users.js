import { config as dotenvConfig } from "dotenv";
dotenvConfig();
import express, { response } from "express";
import {
  createUser,
  createGuest,
  getAllUsers,
  getUserById,
  getUser,
  getUserByUsername,
  updateUser,
  getAllGuests,
  deleteUser,
  deleteGuest
} from "../db/models/user.js";
import {
  getOrdersByUsername
} from "../db/models/orders.js";
import { requireAuthentication, requireAdminAuthorization } from "./utils.js";
import jwt from "jsonwebtoken";
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

const SALT_COUNT = 10;

router.get("/", requireAuthentication, requireAdminAuthorization, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    console.log('ALL USERS:', users)
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/guests", requireAuthentication, requireAdminAuthorization, async (req, res, next) => {
  try {
    const guests = await getAllGuests();
    console.log('ALL GUESTS:', guests)
    res.send(guests);
  } catch (error) {
    next(error);
  }
});

router.post('/newguest', async (req, res, next) => {
  try {
    const guestSessionId = uuidv4()
    // console.log("NEW GUEST SESSION ID:", guestSessionId)
    const newGuest = await createGuest(guestSessionId)
    console.log('new guest;', newGuest)
    res.send(newGuest)
  } catch (error) {
    next(error)
  }
})

router.get('/me', requireAuthentication, async (req, res, next) => {

  try {
    const bearerHeader = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)
    console.log("DECODED USER DATA:", decoded)
    res.send({
      id: decoded.id,
      username: decoded.username
    })
  } catch (error) {
    next()
  }
})

router.get("/:username/orders", async (req, res, next) => {
  const { username } = req.params;

  try {
    const bearerHeader = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)
    console.log(decoded)
    const orders = await getOrdersByUsername({ username: decoded.username });
    // console.log('ORDERS!!!!!!', orders)
    if (orders) {
      res.send(orders);
    } else {
      res.send({
        error: "ERROR",
        title: "OrdersNotFoundWithUsername",
        message: `${username}'s orders is NOT found.`,
      });
    }
    // console.log('USER ORDERS ROUTE:', orders)
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(userId);

    if (user) {
      res.send(user);
    } else {
      res.send({
        error: "ERROR",
        message: `user ${userId} not found`,
        title: "userNotFound",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(password)
  try {
    const user = await getUser({ username, password });

    if (user.isAdmin) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET
      );

      res.send({
        user: {
          id: user.id,
          username: username,
          isAdmin: user.isAdmin
        },
        message: "you're logged in!",
        token,
      });
    } else if (user && !user.isAdmin) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );

      res.send({
        user: {
          id: user.id,
          username: username,
        },
        message: "you're logged in!",
        token,
      })
    } else {
      res.send({
        message: "INCORRECT LOGIN DETAILS!",
      })
    }

  } catch (error) {
    next(error);
  }
});

let JWT_SECRET;

router.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;
  console.log('REQUEST BODY:', req.body)
  const specialAdminPassword = '87654321';
  console.log('JWT SECRET:', process.env.JWT_SECRET)
  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      console.log(`User ${_user.username} is already taken.`);
      res.send({
        error: "ERROR",
        message: `User ${_user.username} is already taken.`,
        name: "UserExistsError",
      });
    } else if (password.length < 7) {
      res.send({
        error: "ERROR",
        message: "Password Too Short!",
        name: "PasswordTooShortError",
      });
    } else {
      const isAdmin = password === specialAdminPassword;

      if (isAdmin) {
        const user = await createUser({ email, username, password, isAdmin })
        const token = jwt.sign({
          id: user.id,
          username,
          isAdmin
        },
          JWT_SECRET, {
          expiresIn: "1w"
        })

        res.send({
          message: 'Thanks for signing up!',
          token: token,
          user: {
            id: user.id,
            username,
            isAdmin
          }
        })
      } else {
        const user = await createUser({ email, username, password })
        console.log('NEW USER:', user)
        const token = jwt.sign({
          id: user.id,
          username
        },
          process.env.JWT_SECRET, {
          expiresIn: "1w"
        })

        res.send({
          message: 'Thanks for signing up!',
          token: token,
          user: {
            id: user.id,
            username
          }
        })
      }
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:userId", requireAuthentication, async (req, res, next) => {
  const { userId } = req.params;
  const { username, password, email } = req.body;

  const updatedFields = {}

  if (username.length > 0) {
    updatedFields.username = username
  }

  if (password.length > 0) {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    updatedFields.password = hashedPassword;
  }

  if (email.length > 0) {
    updatedFields.email = email
  }
  try {
    const bearerHeader = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);

    const user = await getUserById(userId);

    if (user.id === decoded.id) {
      const updatedUser = await updateUser(
        decoded.id,
        updatedFields
      );

      console.log("NEW USER:", updatedUser)
      res.send(updatedUser);
    } else {
      res.status(403).send({
        error: "ERROR",
        message: `User ${decoded.username} is not allowed to update ${user.username}`,
        name: "UNAUTHORIZED USER",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/delete', requireAuthentication, requireAdminAuthorization, async (req, res, next) => {
  const { userId } = req.body;
  try {
    const updatedUsers = await deleteUser(userId)
    res.send(updatedUsers)
  } catch (error) {
    next(error)
  }
})

router.delete('/guest/delete', requireAuthentication, requireAdminAuthorization, async (req, res, next) => {
  const { guestId } = req.body;
  try {
    const updatedGuests = await deleteGuest(guestId)
    res.send(updatedGuests)
  } catch (error) {
    next(error)
  }
})

export default router;

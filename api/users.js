const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  getUser,
  getUserByUsername,
} = require("../db/models");
const router = express.Router();
const jwt = require('jsonwebtoken')

router.get("/", async (req, res, next) => {
  try {
    const users = getAllUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:username", async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await getUserByUsername(username);

    if (user) {
      res.send(user);
    } else {
      res.send({
        error: "ERROR",
        message: `user ${username} not found`,
        title: "userNotFound",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await getUser({ username, password });
    console.log(user)
    if (user) {
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
      });
    } else {
      res.send({
        message: 'INCORRECT LOGIN DETAILS!'
      })
    }
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      res.send({
        error: "ERROR",
        message: `User ${_user.username} is already taken.`,
        name: "UserExistsError",
      });
    } else if (password.length < 8) {
      res.send({
        error: "ERROR",
        message: "Password Too Short!",
        name: "PasswordTooShortError",
      });
    } else {
      const user = await createUser({ email, username, password });
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "Thanks for signing up!",
        token: token,
        user: {
          id: user.id,
          username,
        },
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;

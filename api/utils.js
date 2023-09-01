import jwt from "jsonwebtoken";
import {
  getUserById
} from '../db/models/user.js';

const requireAuthentication = async (req, res, next) => {

  try {
    if (req.headers.authorization) {
      const bearerHeader = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)
      const user = await getUserById(decoded.id)
      req.user = user
    } else {
      res.status(401).send({
        error: "ERROR",
        message: "You must be logged in to perform this action",
        name: "UNAUTHORIZED",
      });
    }
  } catch (error) {
    next(error)
  }
};


export default requireAuthentication;

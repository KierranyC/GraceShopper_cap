import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { getUserById, createGuest, findGuestBySessionId } from '../db/models/user.js';

const requireAuthentication = async (req, res, next) => {
  console.log('REQUIREAUTH LOG:', req.headers.authorization)
  try {
    let user = null;

    // Check for user's JWT token
    if (req.headers.authorization) {
      const bearerHeader = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);
      user = await getUserById(decoded.id);
    } else {
      if (req.headers['x-guest-session-id']) {
        // If a guest session ID is provided in the headers, use it to find the guest
        user = await findGuestBySessionId(req.headers['x-guest-session-id']);
        // console.log(user)
      }
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuthentication;



import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { getUserById, createGuest, findGuestBySessionId } from '../db/models/user.js';

export const requireAuthentication = async (req, res, next) => {
  console.log('REQUIREAUTH HEADERS LOG:', req.headers)
  try {
    let user = null;

    // check for user's JWT token
    if (req.headers.authorization !== undefined) {
      // console.log('ANOTHER REQ HEADERS CHECK:', req.headers.authorization)
      const bearerHeader = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);
      user = await getUserById(decoded.id);
      console.log('USER:', user)
    } else {
      if (req.headers['x-guest-session-id']) {
        // if a guest session ID is provided in the headers, use it to find the guest
        user = await findGuestBySessionId(req.headers['x-guest-session-id']);
        // console.log(user)
      }
    }

    if (user && user.isAdmin) {
      console.log(user.isAdmin)
      req.isAdmin = true
    } else {
      req.isAdmin = false
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdminAuthorization = (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    const error = new Error('Access denied. You must be an admin.');
    error.status = 403;
    next(error);
  }
};




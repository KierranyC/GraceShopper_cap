// import jwt from "jsonwebtoken";
// import {
//   getUserById
// } from '../db/models/user.js';

// const requireAuthentication = async (req, res, next) => {
//   // console.log(req.headers)
//   try {
//     if (req.headers.authorization) {
//       const bearerHeader = req.headers.authorization.split(' ')[1]
//       const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET)
//       const user = await getUserById(decoded.id)
//       req.user = user

//       // console.log(req.user)
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// };


// export default requireAuthentication;


import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { getUserById, createGuest, findGuestBySessionId } from '../db/models/user.js';

const requireAuthentication = async (req, res, next) => {
  try {
    let user = null;

    // Check for user's JWT token
    if (req.headers.authorization) {
      const bearerHeader = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(bearerHeader, process.env.JWT_SECRET);
      user = await getUserById(decoded.id);

    } else {
      // If there's no JWT token, it might be a guest
      // Check if there's a guest session ID in the request or create one
      const guestSessionId = req.headers['x-guest-session-id'];

      if (guestSessionId) {
        // Look for the guest in your database based on the session ID
        user = await findGuestBySessionId(guestSessionId);

        if (!user) {
          // If the guest doesn't exist, create a new guest and store it in the database
          const newGuestSession = uuidv4();
          user = await createGuest({ newGuestSession });
        }
      } else {
        // No JWT token and no guest session ID provided, send a 401 Unauthorized response
        return res.status(401).json({ error: 'Unauthorized', message: 'You must be logged in to perform this action' });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuthentication;

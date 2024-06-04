const jwt = require('jsonwebtoken');
const secretKey = 'secret-key'; // Replace with secret key

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;


// const jwt = require("jsonwebtoken");
// const { User } = require("../modules/auth/UserModel");
// const asyncHandler = require("express-async-handler");

// const protectRoute = asyncHandler(async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.user._id).select("-Password");

//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
// });

// const authenticateSocket = asyncHandler(async (socket, next) => {
//   const token = socket.handshake.headers.authorization.split(" ")[1];

//   if (!token) {
//     return next(new Error("Authentication error: No token provided"));
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     socket.user = await User.findById(decoded.id).select("-Password");

//     next();
//   } catch (err) {
//     next(new Error("Authentication error: Invalid token"));
//   }
// });

// module.exports = { protectRoute, authenticateSocket };


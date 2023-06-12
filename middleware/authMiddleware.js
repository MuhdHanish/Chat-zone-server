const jwt = require('jsonwebtoken');
const userCollection = require('../model/userModel');


const protect = async (req, res, next) => {
 let token;
 if (req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
 ) {
  try {
   token = req.headers.authorization.split("")[1];
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   req.user = await userCollection.findById(decoded.id).select("-password");
   next();
  } catch (err) {
   res.status(401);
   throw new Error('Not authorized, token failed');
  }
 }
 if (!token) {
  res.status(401);
  throw new Error('Not authorized, token failed');
 }
}

module.exports = protect;
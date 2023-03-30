//package that manages de jwt
const jwt = require("jsonwebtoken");
const { UnathenticatedError } = require("../errors");

const authenticationMiddleware = async (req, res, next) => {
  //you can now access the headers

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnathenticatedError("No token provided");
  }

  //we get the token without the bearer
  const token = authHeader.split(" ")[1];

  try {
    //Check if the token was encrypted from your secret in the .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, username } = decoded;
    //we attach a user to the request
    req.user = { id, username };
    //we send it to the next middleware (dashboard in the controller. )
    next();
  } catch (error) {
    throw new UnathenticatedError("Not authorized to access this route", 401);
  }
};

module.exports = authenticationMiddleware;

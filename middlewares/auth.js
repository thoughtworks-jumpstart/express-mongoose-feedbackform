const jwt = require("jsonwebtoken");
const { getJWTSecret } = require("../config/jwt");
const protectRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You are not authorized");
    }
    req.user = jwt.verify(req.cookies.token, getJWTSecret());
    next();
  } catch (err) {
    console.log(err);
    err.statusCode = 401;
    next(err);
  }
};

module.exports = { protectRoute };

const errorHandaler = require("../utils/errorHandaler");
const handleAsyncError = require("./handleAsyncError");
const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = handleAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new errorHandaler("Please login to access this resource", 401));
  }

  req.user = await User.findById(jwt.verify(token, process.env.JWT_SECRET).id);

  next();
});

exports.authRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new errorHandaler(
          `Role : ${req.user.role} is not allow to access this resouce`,
          403
        )
      );
    }
    next();
  };
};

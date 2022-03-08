const errorHandaler = require("../utils/errorHandaler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //   handle Cast Error
  if (err.name === "CastError") {
    err = new errorHandaler(`Resource Not Found. Invalid: ${err.path}`, 400);
  }
  //   handle jsonwebtoken Error
  if (err.name === "JsonWebTokenError") {
    err = new errorHandaler(`Json Web Token Is Invalid, Try Again`, 400);
  }
  //   handle jwt exipare Error
  if (err.name === "TokenExpiredError") {
    err = new errorHandaler(`Json Web Token Is Expired, Try Again`, 400);
  }

  if (err.code === 11000) {
    err = new errorHandaler(
      `Duplicate ${Object.keys(err.keyValue)} Error`,
      400
    );
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

const jwtTokenSend = (user, statusCode, res) => {
  const token = user.genarateJwtToken();

  const option = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    user,
    token,
  });
};

module.exports = jwtTokenSend;

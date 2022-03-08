const errorHandaler = require("../utils/errorHandaler");
const handleAsyncError = require("../middleware/handleAsyncError");
const User = require("../models/userSchema");
const jwtTokenSend = require("../utils/jwtTokenSend");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register New User

exports.registerUser = handleAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new errorHandaler("Please fill all inpute", 422));
  }
  const user = await User.findOne({ email });

  if (user) {
    return next(new errorHandaler("User already exict", 400));
  }
  const registerUser = await User.create({
    name,
    email,
    password,
    avater: {
      public_id: "this is a sample id",
      url: "this is a sample uri",
    },
  });

  jwtTokenSend(registerUser, 201, res);
});

// Login User

exports.loginUser = handleAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandaler("Plase fill all input", 400));
  }

  const loginUser = await User.findOne({ email }).select("+password");
  if (!loginUser) {
    return next(new errorHandaler("User can not find", 401));
  }

  const isPasswordMatch = await loginUser.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new errorHandaler("Invalid credentials", 401));
  }

  jwtTokenSend(loginUser, 200, res);
});

// LogOut User

exports.logOutUser = handleAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Log Out successfully",
  });
});

// Forgot password

exports.forgotPassword = handleAsyncError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandaler("User can not found", 404));
  }

  const resetToken = user.genarateResetPassToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  try {
    sendEmail({
      email: user.email,
      subject: "E-Commerce Password Recovery",
      message: `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then just ignor this`,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new errorHandaler(error.message, 500));
  }
});

// Reset password

exports.resetPassword = handleAsyncError(async (req, res, next) => {
  // createting hash token cause we save our data base
  //  hash token that's why we need hesh token

  const resetPasswordHashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken: resetPasswordHashToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new errorHandaler("Reset token is invalid or has been expired", 400)
    );
  }

  if (req.body.password !== req.body.cPassword) {
    return next(new errorHandaler("Password doesn't match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  jwtTokenSend(user, 200, res);
});

// Get User Details

exports.getUserDetails = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Password

exports.upadateUserPassword = handleAsyncError(async (req, res, next) => {
  let user = await User.findById(req.user.id).select("+password");

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new errorHandaler("Old Passord Doesn't Match", 401));
  }

  if (req.body.newPassword !== req.body.newConfirmPassword) {
    return next(new errorHandaler("Password Doesn't Match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();
  jwtTokenSend(user, 201, res);
});

// Update User Profile

exports.updateUserProfile = handleAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  // :TODO Update Profile Picture Also

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(201).json({
    success: true,
    user,
  });
});

// Get All User -- Admin

exports.getAllUserAdmin = handleAsyncError(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    success: false,
    user,
  });
});

// Get All Single User -- Admin

exports.getSingleUserAdmin = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new errorHandaler(
        `User doesn't exist with this id:- ${req.params.id}`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role -- Admin

exports.updateUserRoleAdmin = handleAsyncError(async (req, res, next) => {
  const { name, email, role } = req.body;

  await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(201).json({
    success: true,
    message: "User Role Update Successfully",
  });
});

// Remove Any User -- Admin

exports.removeUserAdmin = handleAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new errorHandaler(
        `User doesn't exist with this id:- ${req.params.id}`,
        400
      )
    );
  }

  await user.remove();

  res.status(201).json({
    success: true,
    message: "User remove successfully",
  });
});

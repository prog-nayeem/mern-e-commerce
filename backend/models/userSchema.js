const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Inter Your Name"],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please Inter Your Email"],
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Please Inter Validate Email Address"],
    },
    password: {
      type: String,
      required: [true, "Please Inter Your Password"],
      minlength: [6, "Password Should Be Grather Than 6 Characters"],
      select: false,
    },
    avater: {
      public_id: {
        type: String,
        required: [true, "Image Public_Id Is Required"],
      },
      url: {
        type: String,
        required: [true, "Image Url Is Required"],
      },
    },
    role: {
      type: String,
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Password hasing

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 10);
  }
  next();
});

// Jwt token genarate

userSchema.methods.genarateJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Password compareing

userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Genarate password reset token

userSchema.methods.genarateResetPassToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

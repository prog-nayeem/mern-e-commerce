const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  upadateUserPassword,
  updateUserProfile,
  getAllUserAdmin,
  getSingleUserAdmin,
  updateUserRoleAdmin,
  removeUserAdmin,
} = require("../controller/userController");
const { isAuthenticatedUser, authRole } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logOutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router
  .route("/me/password/update")
  .put(isAuthenticatedUser, upadateUserPassword);

router.route("/me/update").put(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authRole("admin"), getAllUserAdmin);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authRole("admin"), getSingleUserAdmin)
  .put(isAuthenticatedUser, authRole("admin"), updateUserRoleAdmin)
  .delete(isAuthenticatedUser, authRole("admin"), removeUserAdmin);

module.exports = router;

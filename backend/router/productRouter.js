const express = require("express");
const {
  createNewProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllProductReview,
  deleteProductReview,
} = require("../controller/productController");
const { isAuthenticatedUser, authRole } = require("../middleware/auth");
const router = express.Router();

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authRole("admin"), createNewProduct);

router.route("/products").get(getAllProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authRole("admin"), updateProduct)
  .delete(isAuthenticatedUser, authRole("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getAllProductReview)
  .delete(isAuthenticatedUser, deleteProductReview);

module.exports = router;

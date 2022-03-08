const handleAsyncError = require("../middleware/handleAsyncError");
const Product = require("../models/productSchema");
const errorHandaler = require("../utils/errorHandaler");
const productFilter = require("../utils/productFilter");

// Create new product

exports.createNewProduct = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all product

exports.getAllProduct = handleAsyncError(async (req, res, next) => {
  const parPageResult = 8;
  const productCount = await Product.countDocuments();

  const productFilters = new productFilter(Product.find(), req.query)
    .search()
    .filter()
    .pagination(parPageResult);

  let product = await productFilters.query;
  // let filterProductCount = product.length;

  // productFilters.pagination(parPageResult);

  // product = await productFilters.query;

  res.status(200).json({
    success: true,
    product,
    parPageResult,
    productCount,
    // filterProductCount,
  });
});

// Get single product

exports.getSingleProduct = handleAsyncError(async (req, res, next) => {
  const singleProduct = await Product.findById(req.params.id);

  if (!singleProduct) {
    return next(
      new errorHandaler(`Product not found this id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    singleProduct,
  });
});

// UpdateProduct

exports.updateProduct = handleAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new errorHandaler(`Product not found this id: ${req.params.id}`, 404)
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// Delete product

exports.deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new errorHandaler(`Product not found this id: ${req.params.id}`, 404)
    );
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

//Create new review and Update the review

exports.createProductReview = handleAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!rating || !productId) {
    return next(new errorHandaler("Please fill all inputs", 400));
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  let product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review Sent Successfully",
  });
});

// Get All Product Review

exports.getAllProductReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    next(
      new errorHandaler(`Product Can't Found This Id:- ${req.query.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete review

exports.deleteProductReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    next(
      new errorHandaler(
        `Product Can't Found This Id:- ${req.query.productId}`,
        404
      )
    );
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numberOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

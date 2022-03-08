const Product = require("../models/productSchema");

exports.updateProductStock = async (orderProductId, orderQuintity) => {
  const product = await Product.findById(orderProductId);

  product.stock -= orderQuintity;
  await product.save({ validateBeforeSave: false });
};

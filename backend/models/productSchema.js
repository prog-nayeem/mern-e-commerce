const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Inter Product Name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Inter Product description"],
    },
    price: {
      type: Number,
      required: [true, "Please Inter Product Price"],
    },
    category: {
      type: String,
      required: [true, "Please Inter Product Category"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: [true, "Image Public_Id Is Required"],
        },
        url: {
          type: String,
          required: [true, "Image Url Is Required"],
        },
      },
    ],

    stock: {
      type: Number,
      required: [true, "Please Inter Product Stock"],
      default: 1,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          maxlength: [5, "Review Can'n More Than 5 Characters"],
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

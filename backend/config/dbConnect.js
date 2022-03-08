const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
    })
    .then(() => console.log("Database connaction successfully"));
};

module.exports = connectDatabase;

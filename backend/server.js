const app = require("./app");
const connectDatabase = require("./config/dbConnect");

// Uncauth Exception Error

process.on("uncaughtException", (err) => {
  console.log(err.message);
  console.log("Shutting Down The Server Due To Uncaught Exception");

  process.exit(1);
});

// database connection
connectDatabase();

// port listining
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is runing port ${process.env.PORT}`);
});

// Unhadle Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(err.message);
  console.log("Shutting Down The Server Due To Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});

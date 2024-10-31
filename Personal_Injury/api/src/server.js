require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to database", error);
  });
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

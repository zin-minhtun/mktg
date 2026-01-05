// To connect with .env
require("dotenv").config();

//test

// Express and Cors
const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());

/***** Routes *****/

// User Route
const userRoute = require("./routes/userRoutes.js");
app.use("/user", userRoute);

/***** End Of Routes *****/

// Server listener
const port = process.env.PORT || 4000;

app.listen(`${port}`, () => {
  console.log(`Server listening on port ${port}`);
});

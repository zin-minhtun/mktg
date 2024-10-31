const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

/***** Routes *****/

// User Routes
const userRouter = require("./routes/userRoutes");
app.use("/api/v1/users", userRouter);

// Mood Routes
const moodRouter = require('./routes/moodRoutes');
app.use('/api/moods', moodRouter);

// Pain Routes
const painRouter = require('./routes/painRoutes');
app.use('/api/pains', painRouter);

// ADL's Routes
const adlRouter = require('./routes/adlRoutes');
app.use('/api/adls', adlRouter);

// Medication Routes
const medsRouter = require('./routes/medsRoutes');
app.use('/api/meds', medsRouter);

//  Body Composition Routes
const bodyCompositionRouter = require("./routes/bodyCompositionRoutes");
app.use("/api/v1/body-compositions", bodyCompositionRouter);

// Sleep Routes
const sleepRouter = require("./routes/sleepRoutes");
app.use("/api/sleep", sleepRouter);

// Exercise Routes
const exerciseRouter = require("./routes/exerciseRoutes");
app.use("/api/v1/exercises", exerciseRouter);

// Social Activity Routes
const socialActivityRouter = require('./routes/socialActivityRoutes');
app.use('/api/v1/social-activities', socialActivityRouter);

/***** End Of Routes *****/

module.exports = app;

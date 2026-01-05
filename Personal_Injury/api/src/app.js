const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Routes Imports
const userRouter = require("./routes/userRoutes");
const bodyCompositionRouter = require("./routes/bodyCompositionRoutes");
const exerciseRouter = require("./routes/exerciseRoutes");
const socialActivityRouter = require('./routes/socialActivityRoutes');
const mealsRouter = require('./routes/mealsRoute');
const moodRouter = require('./routes/moodRoutes');
const painRouter = require('./routes/painRoutes');
const adlRouter = require('./routes/adlRoutes');
const medsRouter = require('./routes/medsRoutes');
const sleepRouter = require("./routes/sleepRoutes");
const dailyLogRouter = require("./routes/dailyLogRoutes");
const supplementRouter = require("./routes/supplementRoutes");
const quoteRouter = require("./routes/quoteRoutes");
const calendarEventRouter = require("./routes/calendarEventRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const reminderRouter = require("./routes/reminderRoutes");
const noteRouter = require("./routes/noteRoutes");
const symptomRouter = require("./routes/symptomRoutes");

// Constants
const API_V1_PREFIX = '/api/v1';
const API_PREFIX = '/api';

/**
 * Creates and configures the Express application.
 * @param {Function} preMiddlewareHook - Async function to run before standard middleware (e.g. AdminJS)
 * @returns {Promise<express.Application>}
 */
const createApp = async (preMiddlewareHook) => {
  const app = express();

  // 1. Run Pre-Middleware Hook (AdminJS)
  // AdminJS needs to be registered BEFORE body parsers for multipart form handling
  if (preMiddlewareHook) {
    await preMiddlewareHook(app);
  }

  // 2. Standard Middleware
  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
    message: "Too many requests..."
  });

  // Apply to all API routes
  app.use('/api/', limiter);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(morgan('dev'));

  // Strict CORS
  const whitelist = [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://192.168.1.100:8081' // Mobile dev
  ];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use((req, res, next) => {
    req.requestTime = new Date();
    next();
  });

  // 3. Register Routes
  app.use(`${API_V1_PREFIX}/users`, userRouter);
  app.use(`${API_V1_PREFIX}/body-compositions`, bodyCompositionRouter);
  app.use(`${API_V1_PREFIX}/exercises`, exerciseRouter);
  app.use(`${API_V1_PREFIX}/social-activities`, socialActivityRouter);
  app.use(`${API_V1_PREFIX}/meals`, mealsRouter);
  app.use(`${API_PREFIX}/moods`, moodRouter);
  app.use(`${API_PREFIX}/pains`, painRouter);
  app.use(`${API_PREFIX}/adls`, adlRouter);
  app.use(`${API_PREFIX}/meds`, medsRouter);
  app.use(`${API_PREFIX}/sleep`, sleepRouter);
  app.use(`${API_PREFIX}/notes`, noteRouter);
  app.use(`${API_PREFIX}/symptoms`, symptomRouter);
  app.use("/api/dailyLog", dailyLogRouter);
  app.use("/api/supplements", supplementRouter);
  app.use("/api/quotes", quoteRouter);
  app.use(`${API_V1_PREFIX}/calendar-events`, calendarEventRouter);
  app.use("/api", onboardingRoutes);
  app.use("/api/reminders", reminderRouter);

  return app;
};

module.exports = { createApp };

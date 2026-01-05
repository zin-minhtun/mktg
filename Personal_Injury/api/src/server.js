require("dotenv").config();
const mongoose = require("mongoose");
const { createApp } = require("./app"); // Changed import
const { initAdmin } = require("./admin/admin");

// Define constants
const DEFAULT_PORT = 5000;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log("Connected to MongoDB");

    // Mask sensitive information in logs
    const connectionStringMasked = process.env.MONGODB_CONNECTION_STRING.replace(
      /mongodb:\/\/([^:]+):([^@]+)@/,
      'mongodb://$1:****@'
    );
    console.log("Using connection:", connectionStringMasked);
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1); // Exit with failure code
  }
}

// Start the server
function startServer(app) {
  const port = process.env.PORT || DEFAULT_PORT;

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Server is running on port ${port}`);
    console.log(`AdminJS available at http://localhost:${port}/admin`);
  });
}

// Initialize application
(async function initialize() {
  await connectToDatabase();

  // Create app with AdminJS injected before body parsers
  const app = await createApp(async (expressApp) => {
    await initAdmin(expressApp);
  });

  startServer(app);
})();

// backend/server.js
require('dotenv').config(); // Loads environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Import Route Files ---
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON in the body of requests

// --- Connect to MongoDB using the .env variable ---
if (!process.env.MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is missing! Check your Render environment variables.');
} else {
  mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging indefinitely
  })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err.message));
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Reconnecting...');
});

// --- Middleware: Verify Database Readiness for API Calls ---
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database is not connected. Please verify MONGO_URI in Render and whitelist 0.0.0.0/0 in MongoDB Atlas Network Access.'
    });
  }
  next();
};

// --- Health / Diagnostics Route ---
app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'ok',
    database: {
      state: dbState,
      isConnected: mongoose.connection.readyState === 1
    },
    environment: {
      hasMongoUri: Boolean(process.env.MONGO_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET)
    }
  });
});

// --- Use Routes ---
// Any request starting with /api/users will be handled by userRoutes
app.use('/api/users', checkDbConnection, userRoutes);

// Any request starting with /api/events will be handled by eventRoutes
app.use('/api/events', checkDbConnection, eventRoutes);

// A simple test route to make sure server is working
app.get('/', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.send(`API is running... Database status: ${isConnected ? 'Connected' : 'DISCONNECTED (Check MONGO_URI & MongoDB Atlas IP Whitelist)'}`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
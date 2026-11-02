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

// --- Reusable Serverless Database Connection ---
let dbConnectionPromise = null;

async function ensureDbConnected(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    return res.status(503).json({
      message: 'MONGO_URI is missing. Please add MONGO_URI in your Vercel Project Settings (Settings -> Environment Variables).'
    });
  }

  try {
    if (!dbConnectionPromise || mongoose.connection.readyState === 0) {
      dbConnectionPromise = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
    }
    await dbConnectionPromise;
    console.log('MongoDB connected successfully.');
    next();
  } catch (err) {
    dbConnectionPromise = null;
    console.error('MongoDB connection error:', err.message);
    return res.status(503).json({
      message: `Database connection failed: ${err.message}. Please ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas (Network Access).`
    });
  }
}

// --- Health / Diagnostics Route ---
app.get(['/api/health', '/health'], async (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  res.json({
    status: 'ok',
    database: {
      state: dbState,
      isConnected: mongoose.connection.readyState === 1
    },
    environment: {
      hasMongoUri: Boolean(mongoUri),
      hasJwtSecret: Boolean(process.env.JWT_SECRET)
    }
  });
});

// --- Use Routes (Mount on both /api/* and /* to support Vercel serverless rewrites) ---
app.use(['/api/users', '/users'], ensureDbConnected, userRoutes);
app.use(['/api/events', '/events'], ensureDbConnected, eventRoutes);

// A simple test route to make sure server is working
app.get(['/', '/api'], (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.send(`API is running... Database status: ${isConnected ? 'Connected' : 'Ready to connect on request'}`);
});

// Export app for Vercel Serverless Function
module.exports = app;

// Start the server if run directly (local development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}
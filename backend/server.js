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
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.log(err));

// --- Use Routes ---
// Any request starting with /api/users will be handled by userRoutes
app.use('/api/users', userRoutes);

// Any request starting with /api/events will be handled by eventRoutes
app.use('/api/events', eventRoutes);


// A simple test route to make sure server is working
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
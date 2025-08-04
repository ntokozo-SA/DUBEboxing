const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const app = express();

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    console.log('Connection state:', mongoose.connection.readyState);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection state:', mongoose.connection.readyState);
  });

// Monitor connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Middleware
app.use(cors());
app.use(express.json());

console.log('PORT:', process.env.PORT);

// Import routes
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const galleryRoutes = require('./routes/gallery');
const teamRoutes = require('./routes/team');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');
const settingsRoutes = require('./routes/settings');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running'
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Serve React frontend build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve index.html for all other routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  page: {
    type: String,
    required: true,
    enum: ['home', 'events', 'gallery', 'team', 'contact', 'admin']
  },
  visitCount: {
    type: Number,
    default: 0
  },
  lastVisited: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
analyticsSchema.index({ page: 1, date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema); 
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  homeVideoUrl: {
    type: String,
    default: ''
  },
  gymHistory: {
    type: String,
    default: 'Welcome to our gym! We are dedicated to helping you achieve your fitness goals.'
  },
  contactInfo: {
    whatsapp: {
      type: String,
      default: '+1234567890'
    },
    email: {
      type: String,
      default: 'info@gym.com'
    },
    address: {
      type: String,
      default: '123 Gym Street, City, Country'
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema); 
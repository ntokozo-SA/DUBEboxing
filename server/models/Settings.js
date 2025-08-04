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
      default: '+27 76 662 3761'
    },
    email: {
      type: String,
      default: 'info@dubeboxing.co.za'
    },
    address: {
      type: String,
      default: 'Mahalefele road, johannesburg, south africa 1801'
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
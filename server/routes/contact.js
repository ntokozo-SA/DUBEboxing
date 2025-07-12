const express = require('express');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// Get contact info (public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.json(settings.contactInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact info (admin)
router.put('/', auth, async (req, res) => {
  try {
    const { whatsapp, email, address } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }

    settings.contactInfo = { whatsapp, email, address };
    await settings.save();

    res.json(settings.contactInfo);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
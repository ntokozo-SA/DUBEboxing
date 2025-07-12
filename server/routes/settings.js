const express = require('express');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const router = express.Router();

// Get settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.json({
      homeVideoUrl: settings.homeVideoUrl,
      gymHistory: settings.gymHistory
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all settings (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update settings (admin)
router.put('/', auth, async (req, res) => {
  try {
    const { homeVideoUrl, gymHistory, contactInfo } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }

    if (homeVideoUrl !== undefined) settings.homeVideoUrl = homeVideoUrl;
    if (gymHistory !== undefined) settings.gymHistory = gymHistory;
    if (contactInfo !== undefined) settings.contactInfo = contactInfo;

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
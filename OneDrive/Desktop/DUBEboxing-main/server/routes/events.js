const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event (admin)
router.post('/', auth, upload.single('posterImage'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Poster image is required' });
    }

    const event = new Event({
      title,
      description,
      posterImage: `/uploads/${req.file.filename}`,
      date: new Date(date)
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event (admin)
router.put('/:id', auth, upload.single('posterImage'), async (req, res) => {
  try {
    const { title, description, date, isActive } = req.body;
    const updateData = { title, description, date: new Date(date), isActive };

    if (req.file) {
      updateData.posterImage = `/uploads/${req.file.filename}`;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
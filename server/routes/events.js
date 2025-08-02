const express = require('express');
const fs = require('fs');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Test route to check if events routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Events routes are working', timestamp: new Date().toISOString() });
});

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching public events...');
    const events = await Event.find({ isActive: true }).sort({ date: -1 });
    console.log(`Found ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error('Events fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get all events (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    console.log('Fetching admin events...');
    const events = await Event.find().sort({ date: -1 });
    console.log(`Found ${events.length} events (admin view)`);
    res.json(events);
  } catch (error) {
    console.error('Admin events fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Create event (admin)
router.post('/', auth, upload, async (req, res) => {
  try {
    console.log('Event upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Image is required' });
    }

    console.log('File uploaded successfully:', req.file.filename);

    // Convert file to base64 for storage
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

    const event = new Event({
      posterImage: base64Image
    });

    console.log('Saving event:', event);
    await event.save();
    console.log('Event saved successfully');
    
    // Clean up the temporary file
    fs.unlinkSync(req.file.path);
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Update event (admin)
router.put('/:id', auth, upload, async (req, res) => {
  try {
    const { isActive } = req.body;
    const updateData = { isActive };

    if (req.file) {
      // Convert file to base64 for storage
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
      updateData.posterImage = base64Image;
      
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
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
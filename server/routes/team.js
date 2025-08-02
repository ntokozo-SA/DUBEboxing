const express = require('express');
const fs = require('fs');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const team = await Team.find({ isActive: true }).sort({ order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all team members (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    const team = await Team.find().sort({ order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create team member (admin)
router.post('/', auth, upload, async (req, res) => {
  try {
    const { name, position, description, order } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Convert file to base64 for storage
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

    const teamMember = new Team({
      name,
      position,
      description,
      imageUrl: base64Image,
      order: order || 0
    });

    await teamMember.save();
    
    // Clean up the temporary file
    fs.unlinkSync(req.file.path);
    
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member (admin)
router.put('/:id', auth, upload, async (req, res) => {
  try {
    const { name, position, description, order, isActive } = req.body;
    const updateData = { name, position, description, order, isActive };

    if (req.file) {
      // Convert file to base64 for storage
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
      updateData.imageUrl = base64Image;
      
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
    }

    const teamMember = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete team member (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const teamMember = await Team.findByIdAndDelete(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
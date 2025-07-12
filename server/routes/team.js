const express = require('express');
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
router.post('/', auth, upload.single('imageUrl'), async (req, res) => {
  try {
    const { name, position, description, order } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const teamMember = new Team({
      name,
      position,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
      order: order || 0
    });

    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member (admin)
router.put('/:id', auth, upload.single('imageUrl'), async (req, res) => {
  try {
    const { name, position, description, order, isActive } = req.body;
    const updateData = { name, position, description, order, isActive };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
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
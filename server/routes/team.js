const express = require('express');
const fs = require('fs');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Test route to check if team routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Team routes are working', timestamp: new Date().toISOString() });
});

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching public team members...');
    const team = await Team.find({ isActive: true }).sort({ order: 1 });
    console.log(`Found ${team.length} team members`);
    res.json(team);
  } catch (error) {
    console.error('Team fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get all team members (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    console.log('Fetching admin team members...');
    const team = await Team.find().sort({ order: 1 });
    console.log(`Found ${team.length} team members (admin view)`);
    res.json(team);
  } catch (error) {
    console.error('Admin team fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Create team member (admin)
router.post('/', auth, upload, async (req, res) => {
  try {
    console.log('Team member upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, position, description, order } = req.body;
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Image is required' });
    }

    console.log('File uploaded successfully:', req.file.filename);

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

    console.log('Saving team member:', teamMember);
    await teamMember.save();
    console.log('Team member saved successfully');
    
    // Clean up the temporary file
    fs.unlinkSync(req.file.path);
    
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Create team error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
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
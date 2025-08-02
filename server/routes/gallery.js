const express = require('express');
const fs = require('fs');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Test route to check if gallery routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Gallery routes are working', timestamp: new Date().toISOString() });
});

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching public gallery images...');
    const gallery = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    console.log(`Found ${gallery.length} gallery images`);
    res.json(gallery);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get all gallery images (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    console.log('Fetching admin gallery images...');
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    console.log(`Found ${gallery.length} gallery images (admin view)`);
    res.json(gallery);
  } catch (error) {
    console.error('Admin gallery fetch error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Create gallery item (admin)
router.post('/', auth, upload, async (req, res) => {
  try {
    console.log('Gallery upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { title, description, category } = req.body;
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'Image is required' });
    }

    console.log('File uploaded successfully:', req.file.filename);

    // Convert file to base64 for storage
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;

    const galleryItem = new Gallery({
      title,
      description,
      imageUrl: base64Image, // Store as base64 instead of file path
      category
    });

    console.log('Saving gallery item:', galleryItem);
    await galleryItem.save();
    console.log('Gallery item saved successfully');
    
    // Clean up the temporary file
    fs.unlinkSync(req.file.path);
    
    res.status(201).json(galleryItem);
  } catch (error) {
    console.error('Create gallery error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Update gallery item (admin)
router.put('/:id', auth, upload, async (req, res) => {
  try {
    const { title, description, category, isActive } = req.body;
    const updateData = { title, description, category, isActive };

    if (req.file) {
      // Convert file to base64 for storage
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
      updateData.imageUrl = base64Image;
      
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
    }

    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gallery item (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
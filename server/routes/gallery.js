const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Test route to check if gallery routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Gallery routes are working', 
    timestamp: new Date().toISOString(),
    modelExists: !!Gallery,
    mongooseConnection: mongoose.connection.readyState === 1,
    connectionState: mongoose.connection.readyState
  });
});

// Health check for gallery
router.get('/health', async (req, res) => {
  try {
    const count = await Gallery.countDocuments();
    res.json({ 
      status: 'OK',
      galleryCount: count,
      connectionState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      error: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

// Test auth route
router.get('/auth-test', auth, (req, res) => {
  res.json({ 
    message: 'Authentication working',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Simple admin test route
router.get('/admin-test', auth, (req, res) => {
  res.json({ 
    message: 'Admin access working',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Test route to check token without gallery data
router.get('/token-test', auth, (req, res) => {
  res.json({ 
    message: 'Token is valid',
    user: req.user,
    tokenExists: true,
    timestamp: new Date().toISOString()
  });
});

// Debug route to check database structure
router.get('/debug', async (req, res) => {
  try {
    const items = await Gallery.find().limit(3);
    const debugInfo = items.map(item => ({
      id: item._id,
      hasTitle: !!item.title,
      hasImageUrl: !!item.imageUrl,
      hasDescription: !!item.description,
      hasCategory: !!item.category,
      hasIsActive: typeof item.isActive !== 'undefined',
      keys: Object.keys(item._doc)
    }));
    
    res.json({
      totalCount: await Gallery.countDocuments(),
      sampleItems: debugInfo,
      schema: Gallery.schema.obj
    });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching public gallery images...');
    
    // Check if Gallery model exists
    if (!Gallery) {
      console.error('Gallery model not found');
      return res.status(500).json({ message: 'Gallery model not available' });
    }
    
    const gallery = await Gallery.find({ isActive: true });
    console.log(`Found ${gallery.length} gallery images`);
    
    // Sort on client side to avoid MongoDB sorting issues
    const sortedGallery = gallery.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(sortedGallery);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get all gallery images (admin)
router.get('/admin', auth, async (req, res) => {
  try {
    console.log('Fetching admin gallery images...');
    console.log('User authenticated:', req.user);
    
    // Check if Gallery model exists
    if (!Gallery) {
      console.error('Gallery model not found');
      return res.status(500).json({ message: 'Gallery model not available' });
    }
    
    // Try to fetch with error handling for each item - remove sorting to avoid MongoDB sorting issues
    const gallery = await Gallery.find().lean();
    console.log(`Found ${gallery.length} gallery images (admin view)`);
    
    // Clean and validate each item
    console.log('Raw gallery items:', gallery.length);
    console.log('First item sample:', gallery[0] ? Object.keys(gallery[0]) : 'No items');
    
    const cleanedGallery = gallery.map((item, index) => {
      try {
        console.log(`Processing item ${index}:`, item._id);
        const cleanedItem = {
          _id: item._id,
          title: item.title || '',
          description: item.description || '',
          imageUrl: item.imageUrl || '',
          category: item.category || 'gym',
          isActive: item.isActive !== undefined ? item.isActive : true,
          createdAt: item.createdAt || new Date(),
          updatedAt: item.updatedAt || new Date()
        };
        console.log(`Item ${index} processed successfully`);
        return cleanedItem;
      } catch (itemError) {
        console.error('Error processing gallery item:', item._id, itemError);
        return null;
      }
    }).filter(item => item !== null);
    
    console.log('Cleaned gallery items:', cleanedGallery.length);
    
    console.log(`Returning ${cleanedGallery.length} valid gallery items`);
    
    // Sort on client side to avoid MongoDB sorting issues with large documents
    const sortedGallery = cleanedGallery.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(sortedGallery);
  } catch (error) {
    console.error('Admin gallery fetch error:', error);
    console.error('Error stack:', error.stack);
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
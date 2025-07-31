const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const upload = require('./middleware/upload');
require('dotenv').config({ path: './config.env' });

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// MongoDB Connection
console.log('🔍 Attempting to connect to MongoDB...');
console.log('🔍 MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
console.log('🔍 NODE_ENV:', process.env.NODE_ENV || 'development');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log('✅ Database:', process.env.MONGODB_URI.split('/').pop());
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('❌ Full error:', err);
  // Don't exit the process, let it continue to show other errors
});

// Import models
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Team = require('./models/Team');
const Analytics = require('./models/Analytics');
const Settings = require('./models/Settings');

// Bypass authentication middleware
const auth = async (req, res, next) => {
  // Skip authentication - allow all requests
  req.user = { id: 'admin', email: 'admin@gym.com', role: 'admin' };
  next();
};



// Initialize default settings if none exist
const initializeSettings = async () => {
  try {
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      const defaultSettings = new Settings({
        contactInfo: {
          phone: '+27 76 662 3761',
          email: 'klethiba25@gmail.com',
          address: 'Mahalefele road, johannesburg, south africa 1801'
        },
        businessHours: {
          monday: '6:00 AM - 10:00 PM',
          tuesday: '6:00 AM - 10:00 PM',
          wednesday: '6:00 AM - 10:00 PM',
          thursday: '6:00 AM - 10:00 PM',
          friday: '6:00 AM - 10:00 PM',
          saturday: '8:00 AM - 8:00 PM',
          sunday: '8:00 AM - 6:00 PM'
        }
      });
      await defaultSettings.save();
      console.log('✅ Default settings created');
    }
  } catch (error) {
    console.error('❌ Error creating default settings:', error);
  }
};



// Events routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Event upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      posterImage: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl
    };
    
    console.log('Event data to save:', eventData);
    
    const event = new Event(eventData);
    await event.save();
    console.log('Event saved successfully:', event);
    res.json(event);
  } catch (error) {
    console.error('Event upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to save event. Please try again.' });
  }
});

app.put('/api/events/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    };
    
    if (req.file) {
      updateData.posterImage = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.posterImage = req.body.imageUrl;
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ message: 'Failed to update event. Please try again.' });
  }
});

app.delete('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Gallery routes
app.get('/api/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/gallery', auth, upload.single('image'), async (req, res) => {
  try {
    console.log('Gallery upload request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const galleryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'gym',
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl
    };
    
    console.log('Gallery data to save:', galleryData);
    
    const item = new Gallery(galleryData);
    await item.save();
    console.log('Gallery item saved successfully:', item);
    res.json(item);
  } catch (error) {
    console.error('Gallery upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Failed to save gallery item. Please try again.' });
  }
});

app.put('/api/gallery/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'gym',
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }
    
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Gallery update error:', error);
    res.status(500).json({ message: 'Failed to update gallery item. Please try again.' });
  }
});

app.delete('/api/gallery/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Team routes
app.get('/api/team', async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/team', auth, upload.single('image'), async (req, res) => {
  try {
    const teamData = {
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl
    };
    
    const member = new Team(teamData);
    await member.save();
    res.json(member);
  } catch (error) {
    console.error('Team upload error:', error);
    res.status(500).json({ message: 'Failed to save team member. Please try again.' });
  }
});

app.put('/api/team/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      position: req.body.position,
      bio: req.body.bio
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      updateData.imageUrl = req.body.imageUrl;
    }
    
    const member = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json(member);
  } catch (error) {
    console.error('Team update error:', error);
    res.status(500).json({ message: 'Failed to update team member. Please try again.' });
  }
});

app.delete('/api/team/:id', auth, async (req, res) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Analytics routes
app.get('/api/analytics', auth, async (req, res) => {
  try {
    const events = await Event.countDocuments();
    const gallery = await Gallery.countDocuments();
    const team = await Team.countDocuments();
    
    res.json({
      pageViews: Math.floor(Math.random() * 1000) + 100,
      uniqueVisitors: Math.floor(Math.random() * 500) + 50,
      events,
      gallery,
      team
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({
        contactInfo: {
          phone: '+27 76 662 3761',
          email: 'klethiba25@gmail.com',
          address: 'Mahalefele road, johannesburg, south africa 1801'
        },
        businessHours: {
          monday: '6:00 AM - 10:00 PM',
          tuesday: '6:00 AM - 10:00 PM',
          wednesday: '6:00 AM - 10:00 PM',
          thursday: '6:00 AM - 10:00 PM',
          friday: '6:00 AM - 10:00 PM',
          saturday: '8:00 AM - 8:00 PM',
          sunday: '8:00 AM - 6:00 PM'
        }
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/settings', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    // Here you could save contact form submissions to a database
    // For now, just log and return success
    console.log('Contact form submission:', req.body);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server starting on port ${PORT}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Admin panel accessible without login`);
}); 
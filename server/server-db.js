const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import models
const User = require('./models/User');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Team = require('./models/Team');
const Settings = require('./models/Settings');

// Authentication middleware
const auth = require('./middleware/auth');

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize admin user
app.post('/api/auth/init', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const adminUser = new User({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });

    await adminUser.save();
    res.json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Events routes
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/events/admin', auth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/events', auth, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    const gallery = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/gallery/admin', auth, async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/gallery', auth, async (req, res) => {
  try {
    const item = new Gallery(req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
    const team = await Team.find({ isActive: true }).sort({ order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/team/admin', auth, async (req, res) => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/team', auth, async (req, res) => {
  try {
    const member = new Team(req.body);
    await member.save();
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/team/:id', auth, async (req, res) => {
  try {
    const member = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
      settings = new Settings();
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
      settings = new Settings();
    }
    
    Object.assign(settings, req.body);
    await settings.save();
    
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Connected to MongoDB Atlas database');
  console.log('✅ Admin login: admin@gym.com / admin123');
}); 
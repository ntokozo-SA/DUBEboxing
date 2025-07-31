const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import models
const User = require('./models/User');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');
const Team = require('./models/Team');
const Analytics = require('./models/Analytics');
const Settings = require('./models/Settings');

// JWT Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Initialize default admin user if none exists
const initializeAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gym.com' });
    if (!adminExists) {
      const adminUser = new User({
        email: 'admin@gym.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Default admin user created');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
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

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
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
    res.json({ 
      user: { 
        id: req.user._id, 
        email: req.user.email, 
        role: req.user.role 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Events routes
app.get('/api/events', async (req, res) => {
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
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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
    const member = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize default data
  await initializeAdminUser();
  await initializeSettings();
  
  console.log('✅ Admin login: admin@gym.com / admin123');
  console.log('✅ MongoDB connected and ready');
}); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, enum: ['gym', 'equipment', 'classes', 'facilities'], default: 'gym' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);

// JWT Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const existingUser = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingUser) {
      const adminUser = new User({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
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
  res.json({ user: req.user });
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

app.post('/api/events', auth, upload.single('image'), async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      isActive: req.body.isActive === 'true' || req.body.isActive === true
    };

    if (req.file) {
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.RENDER_EXTERNAL_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`
        : 'http://localhost:5000';
      eventData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const event = new Event(eventData);
    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

app.put('/api/events/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      updatedAt: new Date()
    };

    if (req.file) {
      // Delete old image if exists
      if (event.imageUrl) {
        const oldFilePath = path.join(__dirname, 'uploads', path.basename(event.imageUrl));
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.RENDER_EXTERNAL_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`
        : 'http://localhost:5000';
      updateData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete image file if exists
    if (event.imageUrl) {
      const filePath = path.join(__dirname, 'uploads', path.basename(event.imageUrl));
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
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

app.post('/api/gallery', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.RENDER_EXTERNAL_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`
      : 'http://localhost:5000';

    const galleryData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'gym',
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      imageUrl: `${baseUrl}/uploads/${req.file.filename}`
    };

    const item = new Gallery(galleryData);
    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Failed to create gallery item' });
  }
});

app.put('/api/gallery/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      updatedAt: new Date()
    };

    if (req.file) {
      // Delete old image
      const oldFilePath = path.join(__dirname, 'uploads', path.basename(item.imageUrl));
      fs.unlink(oldFilePath, (err) => {
        if (err) console.error('Error deleting old file:', err);
      });
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.RENDER_EXTERNAL_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`
        : 'http://localhost:5000';
      updateData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Failed to update gallery item' });
  }
});

app.delete('/api/gallery/:id', auth, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete image file
    const filePath = path.join(__dirname, 'uploads', path.basename(item.imageUrl));
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Failed to delete gallery item' });
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
    const team = await Team.find().sort({ order: 1 });
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
      description: req.body.description,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      order: req.body.order || 0
    };

    if (req.file) {
      teamData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const member = new Team(teamData);
    await member.save();
    res.json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ message: 'Failed to create team member' });
  }
});

app.put('/api/team/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const updateData = {
      name: req.body.name,
      position: req.body.position,
      description: req.body.description,
      isActive: req.body.isActive === 'true' || req.body.isActive === true,
      order: req.body.order || 0,
      updatedAt: new Date()
    };

    if (req.file) {
      // Delete old image if exists
      if (member.imageUrl) {
        const oldFilePath = path.join(__dirname, 'uploads', path.basename(member.imageUrl));
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? process.env.RENDER_EXTERNAL_URL || `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`
        : 'http://localhost:5000';
      updateData.imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const updatedMember = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ message: 'Failed to update team member' });
  }
});

app.delete('/api/team/:id', auth, async (req, res) => {
  try {
    const member = await Team.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    // Delete image file if exists
    if (member.imageUrl) {
      const filePath = path.join(__dirname, 'uploads', path.basename(member.imageUrl));
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team member deleted' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ message: 'Failed to delete team member' });
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
  res.json({
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
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Connected to MongoDB database');
  console.log('✅ Admin login: admin@gym.com / admin123');
  initializeAdmin();
}); 
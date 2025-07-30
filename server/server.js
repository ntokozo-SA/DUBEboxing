const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Simple in-memory storage (temporary solution)
const users = [
  {
    id: 1,
    email: 'admin@gym.com',
    password: 'admin123',
    role: 'admin'
  }
];

const events = [];
const gallery = [];
const team = [];

// Simple authentication middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token === 'admin-token') {
    req.user = users[0];
    next();
  } else {
    res.status(401).json({ message: 'Access denied' });
  }
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({
      token: 'admin-token',
      user: { id: user.id, email: user.email, role: user.role }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// Events routes
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', auth, (req, res) => {
  const event = { id: Date.now(), ...req.body };
  events.push(event);
  res.json(event);
});

app.put('/api/events/:id', auth, (req, res) => {
  const index = events.findIndex(e => e.id == req.params.id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

app.delete('/api/events/:id', auth, (req, res) => {
  const index = events.findIndex(e => e.id == req.params.id);
  if (index !== -1) {
    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Gallery routes
app.get('/api/gallery', (req, res) => {
  res.json(gallery);
});

app.post('/api/gallery', auth, (req, res) => {
  const item = { id: Date.now(), ...req.body };
  gallery.push(item);
  res.json(item);
});

app.delete('/api/gallery/:id', auth, (req, res) => {
  const index = gallery.findIndex(g => g.id == req.params.id);
  if (index !== -1) {
    gallery.splice(index, 1);
    res.json({ message: 'Gallery item deleted' });
  } else {
    res.status(404).json({ message: 'Gallery item not found' });
  }
});

// Team routes
app.get('/api/team', (req, res) => {
  res.json(team);
});

app.post('/api/team', auth, (req, res) => {
  const member = { id: Date.now(), ...req.body };
  team.push(member);
  res.json(member);
});

app.put('/api/team/:id', auth, (req, res) => {
  const index = team.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    team[index] = { ...team[index], ...req.body };
    res.json(team[index]);
  } else {
    res.status(404).json({ message: 'Team member not found' });
  }
});

app.delete('/api/team/:id', auth, (req, res) => {
  const index = team.findIndex(t => t.id == req.params.id);
  if (index !== -1) {
    team.splice(index, 1);
    res.json({ message: 'Team member deleted' });
  } else {
    res.status(404).json({ message: 'Team member not found' });
  }
});

// Analytics routes
app.get('/api/analytics', auth, (req, res) => {
  res.json({
    pageViews: Math.floor(Math.random() * 1000) + 100,
    uniqueVisitors: Math.floor(Math.random() * 500) + 50,
    events: events.length,
    gallery: gallery.length,
    team: team.length
  });
});

// Settings routes
app.get('/api/settings', (req, res) => {
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

app.put('/api/settings', auth, (req, res) => {
  res.json({ message: 'Settings updated' });
});

const PORT = process.env.PORT || 5000;



app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✅ Admin login: admin@gym.com / admin123');
}); 

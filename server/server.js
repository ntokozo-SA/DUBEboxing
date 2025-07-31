const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

console.log('PORT:', process.env.PORT);

// In-memory storage
const events = [];
const gallery = [];
const team = [];

// Events routes
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const event = { id: Date.now(), ...req.body };
  events.push(event);
  res.json(event);
});

app.put('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id == req.params.id);
  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  const index = events.findIndex(e => e.id == req.params.id);
  if (index !== -1) {
    events.splice(index, 1);
    res.json({ message: 'Event deleted' });
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// Add this at the end to start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

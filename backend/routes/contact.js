const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { auth, requireRole } = require('../middleware/auth');

// POST send message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    await new Contact({ name, email, subject: subject || 'General', message }).save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Could not send message' });
  }
});

// GET all messages (admin only)
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: 'Could not load messages' });
  }
});

module.exports = router;

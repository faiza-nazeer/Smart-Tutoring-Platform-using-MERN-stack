const express = require('express');
const router = express.Router();

const contacts = []; // temporary in-memory store

// POST send message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const contact = {
      id: Date.now(),
      name,
      email,
      subject: subject || 'General',
      message,
      createdAt: new Date(),
    };
    contacts.push(contact);
    console.log('New contact message:', contact);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all messages (for admin)
router.get('/', async (req, res) => {
  res.json(contacts);
});

module.exports = router;
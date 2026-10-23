const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');

// GET all reviews (public)
router.get('/', async (req, res) => {
  try {
    res.json(await Review.find().populate('student', 'name').populate('tutor', 'name'));
  } catch (err) {
    res.status(500).json({ message: 'Could not load reviews' });
  }
});

// GET reviews for a specific tutor (must be BEFORE /:id)
router.get('/tutor/:tutorId', async (req, res) => {
  try {
    res.json(await Review.find({ tutor: req.params.tutorId }).populate('student', 'name'));
  } catch (err) {
    res.status(400).json({ message: 'Invalid tutor id' });
  }
});

// GET single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('student', 'name')
      .populate('tutor', 'name');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: 'Invalid review id' });
  }
});

// POST create review: reviewer is always the logged-in user
router.post('/', auth, async (req, res) => {
  try {
    const { tutor, course, rating, comment } = req.body;
    const saved = await new Review({
      student: req.user.id, tutor, course, rating, comment,
    }).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE review: the author or an admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (req.user.role !== 'admin' && String(review.student) !== req.user.id) {
      return res.status(403).json({ message: 'Not your review' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete review' });
  }
});

module.exports = router;

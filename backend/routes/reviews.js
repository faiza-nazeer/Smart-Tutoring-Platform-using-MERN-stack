const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

// Keep the tutor's average rating and review count on their profile up to date.
async function refreshTutorRating(tutorId) {
  const all = await Review.find({ tutor: tutorId }).select('rating');
  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  await User.findByIdAndUpdate(tutorId, { rating: Math.round(avg * 10) / 10, reviews: all.length });
}

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

// POST create review: only a student who has completed a session with this tutor, once per tutor
router.post('/', auth, requireRole('student'), async (req, res) => {
  try {
    const { tutor, course, rating, comment } = req.body;
    const hadSession = await Booking.exists({ student: req.user.id, tutor, status: 'Completed' });
    if (!hadSession) {
      return res.status(403).json({ message: 'You can review a tutor after completing a session with them' });
    }
    if (await Review.exists({ student: req.user.id, tutor })) {
      return res.status(400).json({ message: 'You have already reviewed this tutor' });
    }
    const saved = await new Review({
      student: req.user.id, tutor, course, rating, comment: String(comment || '').slice(0, 500),
    }).save();
    await refreshTutorRating(tutor);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT reply: the reviewed tutor can respond to a review
router.put('/:id/reply', auth, requireRole('tutor'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (String(review.tutor) !== req.user.id) {
      return res.status(403).json({ message: 'You can only reply to your own reviews' });
    }
    const reply = String(req.body.reply || '').trim().slice(0, 500);
    if (!reply) return res.status(400).json({ message: 'Reply cannot be empty' });
    review.tutorReply = reply;
    res.json(await review.save());
  } catch (err) {
    res.status(400).json({ message: 'Could not save reply' });
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
    await refreshTutorRating(review.tutor);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete review' });
  }
});

module.exports = router;

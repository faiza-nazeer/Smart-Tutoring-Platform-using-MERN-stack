const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const populate = (q) => q.populate('student', 'name email').populate('tutor', 'name email');
const isParticipant = (b, userId) =>
  String(b.student) === userId || String(b.tutor) === userId;

// Allowed status changes: tutors confirm / complete / cancel, students may only cancel.
const TUTOR_MOVES = { Pending: ['Confirmed', 'Cancelled'], Confirmed: ['Completed', 'Cancelled'] };
const STUDENT_MOVES = { Pending: ['Cancelled'], Confirmed: ['Cancelled'] };

// GET bookings: admins see all, everyone else only their own
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { $or: [{ student: req.user.id }, { tutor: req.user.id }] };
    res.json(await populate(Booking.find(filter)));
  } catch (err) {
    res.status(500).json({ message: 'Could not load bookings' });
  }
});

// GET single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await populate(Booking.findById(req.params.id));
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const ids = [booking.student?._id, booking.tutor?._id].map(String);
    if (req.user.role !== 'admin' && !ids.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Invalid booking id' });
  }
});

// POST create booking: the student is always the logged-in user
router.post('/', auth, async (req, res) => {
  try {
    const { tutor, course, subject, date, time, duration, sessionType, amount, notes } = req.body;
    const saved = await new Booking({
      student: req.user.id,
      tutor, course, subject, date, time, duration, sessionType, amount, notes,
      status: 'Pending',
    }).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update booking: participants or admin, limited fields
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const admin = req.user.role === 'admin';
    if (!admin && !isParticipant(booking, req.user.id)) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    const wasCompleted = booking.status === 'Completed';

    if (!admin) {
      if (['Completed', 'Cancelled'].includes(booking.status)) {
        return res.status(400).json({ message: `This session is already ${booking.status.toLowerCase()}` });
      }
      const next = req.body.status;
      if (next !== undefined && next !== booking.status) {
        const moves = String(booking.tutor) === req.user.id ? TUTOR_MOVES : STUDENT_MOVES;
        if (!(moves[booking.status] || []).includes(next)) {
          return res.status(403).json({ message: `You cannot change this session from ${booking.status} to ${next}` });
        }
      }
    }

    const allowed = admin
      ? ['status', 'date', 'time', 'notes', 'duration', 'sessionType', 'amount']
      : ['status', 'date', 'time', 'notes'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) booking[key] = req.body[key];
    }
    const saved = await booking.save();
    if (!wasCompleted && saved.status === 'Completed') {
      await User.findByIdAndUpdate(saved.tutor, { $inc: { sessions: 1 } });
    }
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE booking: participants or admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'admin' && !isParticipant(booking, req.user.id)) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete booking' });
  }
});

module.exports = router;

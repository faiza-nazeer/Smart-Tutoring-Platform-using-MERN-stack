const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, optionalAuth, requireRole } = require('../middleware/auth');

// Fields any user may change on their own profile.
const SELF_EDITABLE = ['name', 'phone', 'bio', 'avatar', 'city', 'subject', 'price'];
// Extra fields only admins may change.
const ADMIN_EDITABLE = [...SELF_EDITABLE, 'role', 'status', 'rating', 'sessions', 'reviews'];

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

const isAdmin = (req) => req.user && req.user.role === 'admin';

// GET all users. Public callers (landing-page stats, tutor listing) never see contact details
// or suspended accounts; admins see everything except passwords.
router.get('/', optionalAuth, async (req, res) => {
  try {
    const users = isAdmin(req)
      ? await User.find().select('-password')
      : await User.find({ status: { $ne: 'Suspended' } }).select('-password -email -phone');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Could not load users' });
  }
});

// GET single user
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const self = req.user && req.user.id === req.params.id;
    const projection = self || isAdmin(req) ? '-password' : '-password -email -phone';
    const user = await User.findById(req.params.id).select(projection);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Invalid user id' });
  }
});

// POST create user (admin only; password is hashed)
router.post('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const saved = await new User({
      ...pick(rest, [...ADMIN_EDITABLE, 'email']),
      password: await bcrypt.hash(password, 10),
    }).save();
    const { password: _pw, ...safe } = saved.toObject();
    res.status(201).json(safe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update user: the user themself (limited fields) or an admin
router.put('/:id', auth, async (req, res) => {
  try {
    const admin = isAdmin(req);
    if (!admin && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'You can only edit your own profile' });
    }
    const updates = pick(req.body, admin ? ADMIN_EDITABLE : SELF_EDITABLE);
    if (admin && typeof req.body.password === 'string' && req.body.password.length >= 8) {
      updates.password = await bcrypt.hash(req.body.password, 10);
    }
    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE user (admin only)
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete user' });
  }
});

module.exports = router;

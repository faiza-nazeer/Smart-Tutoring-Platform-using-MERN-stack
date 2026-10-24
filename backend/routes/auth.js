const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const SELF_SERVICE_ROLES = ['student', 'tutor']; // admins are never created via signup

function publicUser(u) {
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    city: u.city,
    subject: u.subject,
    price: u.price,
  };
}

function signToken(u) {
  return jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, password, city } = req.body;
    // Subject and price are optional at signup; tutors set them later from their profile page.
    const subject = String(req.body.subject || '').trim();
    const price = Number(req.body.price);
    const email = String(req.body.email || '').trim().toLowerCase();
    const role = SELF_SERVICE_ROLES.includes(req.body.role) ? req.body.role : 'student';

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const saved = await new User({
      name,
      email,
      password: hashedPassword,
      role,
      subject: role === 'tutor' && subject ? subject : undefined,
      price: role === 'tutor' && price > 0 ? price : undefined,
      city,
    }).save();

    res.status(201).json({ token: signToken(saved), user: publicUser(saved) });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Could not create account' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const raw = String(req.body.email || '').trim();
    const password = req.body.password;
    if (!raw || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email: { $in: [raw, raw.toLowerCase()] } });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.status === 'Suspended') {
      return res.status(403).json({ message: 'This account has been suspended' });
    }

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// CHANGE PASSWORD (logged-in users)
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(String(currentPassword || ''), user.password);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Could not update password' });
  }
});

// FORGOT PASSWORD
// Resetting a password from just an email address lets anyone take over any account,
// so this is disabled unless ALLOW_INSECURE_PASSWORD_RESET=true (local demos only).
// A production version would email a one-time reset link instead.
router.post('/forgot-password', async (req, res) => {
  if (process.env.ALLOW_INSECURE_PASSWORD_RESET !== 'true') {
    return res.status(403).json({
      message: 'Password reset by email is not enabled in this deployment. Please contact support.',
    });
  }
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const { newPassword } = req.body;
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Could not reset password' });
  }
});

module.exports = router;

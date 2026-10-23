const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, requireRole } = require('../middleware/auth');

const FIELDS = ['title', 'subject', 'level', 'price', 'description', 'status'];
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));

// GET all courses (public)
router.get('/', async (req, res) => {
  try {
    res.json(await Course.find().populate('tutor', 'name email'));
  } catch (err) {
    res.status(500).json({ message: 'Could not load courses' });
  }
});

// GET single course (public)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutor', 'name email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: 'Invalid course id' });
  }
});

// POST create course (tutor creates their own; admin may assign any tutor)
router.post('/', auth, requireRole('tutor', 'admin'), async (req, res) => {
  try {
    const tutor = req.user.role === 'admin' ? (req.body.tutor || req.user.id) : req.user.id;
    const saved = await new Course({ ...pick(req.body, FIELDS), tutor }).save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update course (owner tutor or admin)
router.put('/:id', auth, requireRole('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role !== 'admin' && String(course.tutor) !== req.user.id) {
      return res.status(403).json({ message: 'Not your course' });
    }
    Object.assign(course, pick(req.body, FIELDS));
    res.json(await course.save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE course (owner tutor or admin)
router.delete('/:id', auth, requireRole('tutor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (req.user.role !== 'admin' && String(course.tutor) !== req.user.id) {
      return res.status(403).json({ message: 'Not your course' });
    }
    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Could not delete course' });
  }
});

module.exports = router;

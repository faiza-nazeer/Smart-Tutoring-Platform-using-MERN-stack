const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] },
  price: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['Published', 'Draft', 'Review'], default: 'Draft' },
  rating: { type: Number, default: 0 },
  studentsEnrolled: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
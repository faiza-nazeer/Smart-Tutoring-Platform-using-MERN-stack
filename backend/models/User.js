const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'tutor', 'admin'], default: 'student' },
  subject: { type: String },        // for tutors
  city: { type: String },
  phone: { type: String },
  bio: { type: String },
  avatar: { type: String },
  status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Active' },
  rating: { type: Number, default: 0 },
  sessions: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
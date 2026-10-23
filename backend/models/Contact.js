const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  subject: { type: String, default: 'General', trim: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 5000 },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);

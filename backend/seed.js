// Creates demo accounts + sample data. Safe to re-run: it only adds what is missing
// and never deletes existing data.   Usage:  npm run seed
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Course = require('./models/Course');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const PASSWORD = process.env.SEED_PASSWORD || 'Demo@12345';

const accounts = [
  { name: 'Demo Admin', email: 'admin@etutor.demo', role: 'admin', city: 'Lahore' },
  { name: 'Demo Student', email: 'student@etutor.demo', role: 'student', city: 'Lahore' },
  { name: 'Ayesha Khan', email: 'ayesha@etutor.demo', role: 'tutor', subject: 'Mathematics', city: 'Lahore', price: 1500, rating: 4.9, bio: 'Mathematics tutor with 6 years of experience helping students from O-Level to university.' },
  { name: 'Zain Ahmed', email: 'zain@etutor.demo', role: 'tutor', subject: 'Physics', city: 'Islamabad', price: 1800, rating: 4.7, bio: 'Physics tutor focused on intermediate and entry-test preparation.' },
  { name: 'Sara Raza', email: 'sara@etutor.demo', role: 'tutor', subject: 'English', city: 'Karachi', price: 1200, rating: 4.8, bio: 'English language and grammar tutor for school and IELTS students.' },
];

const courseTemplates = {
  'ayesha@etutor.demo': [
    { title: 'Master Mathematics', subject: 'Mathematics', level: 'All Levels', price: 1500, description: 'Algebra, calculus and statistics from the ground up.' },
    { title: 'Calculus Crash Course', subject: 'Mathematics', level: 'Advanced', price: 1800, description: 'Limits, derivatives and integrals with exam-style practice.' },
  ],
  'zain@etutor.demo': [
    { title: 'Physics for Intermediate', subject: 'Physics', level: 'Intermediate', price: 1800, description: 'Mechanics, waves and electricity with worked examples.' },
  ],
  'sara@etutor.demo': [
    { title: 'English Grammar Masterclass', subject: 'English', level: 'Beginner', price: 1200, description: 'Grammar, writing and speaking practice.' },
  ],
};

async function run() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set');
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash(PASSWORD, 10);

  const byEmail = {};
  for (const a of accounts) {
    let u = await User.findOne({ email: a.email });
    if (!u) {
      u = await User.create({ ...a, password: hash, status: 'Active' });
      console.log('created user', a.email);
    }
    byEmail[a.email] = u;
  }

  for (const [tutorEmail, list] of Object.entries(courseTemplates)) {
    for (const c of list) {
      const exists = await Course.findOne({ title: c.title, tutor: byEmail[tutorEmail]._id });
      if (!exists) {
        await Course.create({ ...c, tutor: byEmail[tutorEmail]._id, status: 'Published', rating: 4.8, studentsEnrolled: 12 });
        console.log('created course', c.title);
      }
    }
  }

  const student = byEmail['student@etutor.demo'];
  if (!(await Booking.countDocuments({ student: student._id }))) {
    const inDays = (n) => new Date(Date.now() + n * 864e5).toISOString().split('T')[0];
    await Booking.create([
      { student: student._id, tutor: byEmail['ayesha@etutor.demo']._id, subject: 'Calculus', date: inDays(2), time: '4:00 PM', duration: '1 hr', sessionType: 'online', amount: 1500, status: 'Confirmed' },
      { student: student._id, tutor: byEmail['zain@etutor.demo']._id, subject: 'Physics', date: inDays(5), time: '5:00 PM', duration: '1 hr', sessionType: 'online', amount: 1800, status: 'Pending' },
      { student: student._id, tutor: byEmail['sara@etutor.demo']._id, subject: 'English', date: inDays(-3), time: '3:00 PM', duration: '1 hr', sessionType: 'in-person', amount: 1200, status: 'Completed' },
    ]);
    console.log('created demo bookings');
  }

  const tutor = byEmail['ayesha@etutor.demo'];
  if (!(await Review.countDocuments({ tutor: tutor._id }))) {
    await Review.create({ student: student._id, tutor: tutor._id, rating: 5, comment: 'Explains difficult topics clearly. My calculus grades improved a lot.' });
    console.log('created demo review');
  }

  console.log(`\nDone. Demo logins (password: ${PASSWORD}):\n  admin@etutor.demo\n  student@etutor.demo\n  ayesha@etutor.demo (tutor)`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });

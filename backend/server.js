const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

for (const key of ['MONGO_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.warn('WARNING: JWT_SECRET is shorter than 32 characters. Use a long random value in production.');
}

const app = express();
app.set('trust proxy', 1); // running behind Render's proxy

// Frontends allowed to call this API. Exact origins only (no wildcard, no trailing slash).
// CLIENT_URL (comma-separated) can add more without a code change.
const normalizeOrigin = (o) => o.trim().replace(/\/+$/, '');
const allowedOrigins = [
  'https://smart-tutoring-platform-using-mern-stack-c90gi1f9i.vercel.app', // deployed frontend
  'http://localhost:5173', // local development
  ...(process.env.CLIENT_URL || '').split(','),
].map(normalizeOrigin).filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow non-browser tools (no Origin header) and listed frontends
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 86400, // browsers may cache the preflight for a day
};

app.use(helmet());
// CORS runs before every route and answers OPTIONS preflights itself (204) before auth/rate limiting.
app.use(cors(corsOptions));
app.use(express.json({ limit: '100kb' }));

// Slow down brute-force login / signup attempts
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again in a few minutes.' },
}));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));

app.get('/', (req, res) => res.json({ message: 'eTutor API is running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 404 + error handlers
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err.message);
  res.status(err.message === 'Not allowed by CORS' ? 403 : 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
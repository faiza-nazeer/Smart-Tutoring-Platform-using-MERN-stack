const jwt = require('jsonwebtoken');

function readToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

// Requires a valid JWT. Sets req.user = { id, role }.
function auth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: String(payload.id), role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Sets req.user if a valid token is present, otherwise continues as anonymous.
function optionalAuth(req, res, next) {
  const token = readToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: String(payload.id), role: payload.role };
    } catch { /* treat as anonymous */ }
  }
  next();
}

// Use after auth. Example: requireRole('admin') or requireRole('tutor', 'admin')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do that' });
    }
    next();
  };
}

module.exports = { auth, optionalAuth, requireRole };

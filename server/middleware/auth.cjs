const jwt = require('jsonwebtoken');
const db = require('../database.cjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user from database
    db.get('SELECT id, email, name, photo FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err || !user) {
        return res.status(403).json({ error: 'User not found' });
      }
      
      req.user = user;
      next();
    });
  });
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

module.exports = {
  authenticateToken,
  generateTokens,
  JWT_SECRET
};
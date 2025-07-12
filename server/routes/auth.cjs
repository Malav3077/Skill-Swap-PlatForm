const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const db = require('../database.cjs');
const { generateTokens } = require('../middleware/auth.cjs');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().max(100).optional(),
  bio: Joi.string().max(500).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password, location, bio } = value;

    // Check if user exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      db.run(
        'INSERT INTO users (name, email, password_hash, location, bio) VALUES (?, ?, ?, ?, ?)',
        [name, email, passwordHash, location || null, bio || null],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;
          const tokens = generateTokens(userId);

          res.status(201).json({
            message: 'User created successfully',
            user: { id: userId, name, email, location, bio },
            ...tokens
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const tokens = generateTokens(user.id);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          location: user.location,
          bio: user.bio
        },
        ...tokens
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth (simplified for demo)
router.post('/google', (req, res) => {
  const { token, profile } = req.body;
  
  // In a real app, you would verify the Google token
  // For demo purposes, we'll create/login the user
  const { email, name, picture } = profile;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (user) {
      // User exists, login
      const tokens = generateTokens(user.id);
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          location: user.location,
          bio: user.bio
        },
        ...tokens
      });
    } else {
      // Create new user
      db.run(
        'INSERT INTO users (name, email, photo, google_id) VALUES (?, ?, ?, ?)',
        [name, email, picture, profile.id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;
          const tokens = generateTokens(userId);

          res.status(201).json({
            message: 'User created successfully',
            user: { id: userId, name, email, photo: picture },
            ...tokens
          });
        }
      );
    }
  });
});

module.exports = router;
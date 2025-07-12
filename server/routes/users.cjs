const express = require('express');
const Joi = require('joi');
const db = require('../database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get(`
    SELECT u.*, 
           COUNT(DISTINCT sr1.id) as swaps_completed,
           AVG(r.rating) as average_rating
    FROM users u
    LEFT JOIN swap_requests sr1 ON (u.id = sr1.requester_id OR u.id = sr1.provider_id) AND sr1.status = 'completed'
    LEFT JOIN reviews r ON u.id = r.reviewee_id
    WHERE u.id = ?
    GROUP BY u.id
  `, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...user,
      swaps_completed: user.swaps_completed || 0,
      average_rating: user.average_rating ? parseFloat(user.average_rating).toFixed(1) : null
    });
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, location, bio, photo } = req.body;

  const schema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    location: Joi.string().max(100).optional(),
    bio: Joi.string().max(500).optional(),
    photo: Joi.string().uri().optional()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const updates = [];
  const values = [];
  
  Object.entries(value).forEach(([key, val]) => {
    if (val !== undefined) {
      updates.push(`${key} = ?`);
      values.push(val);
    }
  });

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(userId);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;

  db.get(`
    SELECT u.id, u.name, u.photo, u.location, u.bio, u.created_at,
           COUNT(DISTINCT sr.id) as swaps_completed,
           AVG(r.rating) as average_rating
    FROM users u
    LEFT JOIN swap_requests sr ON (u.id = sr.requester_id OR u.id = sr.provider_id) AND sr.status = 'completed'
    LEFT JOIN reviews r ON u.id = r.reviewee_id
    WHERE u.id = ?
    GROUP BY u.id
  `, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      ...user,
      swaps_completed: user.swaps_completed || 0,
      average_rating: user.average_rating ? parseFloat(user.average_rating).toFixed(1) : null
    });
  });
});

module.exports = router;
const express = require('express');
const Joi = require('joi');
const db = require('../database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

const reviewSchema = Joi.object({
  swap_request_id: Joi.number().integer().required(),
  reviewee_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  feedback: Joi.string().max(500).optional()
});

// Get reviews for a user
router.get('/user/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;

  db.all(`
    SELECT r.*, u.name as reviewer_name, u.photo as reviewer_photo
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewee_id = ?
    ORDER BY r.created_at DESC
  `, [userId], (err, reviews) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(reviews);
  });
});

// Create review
router.post('/', authenticateToken, (req, res) => {
  const { error, value } = reviewSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { swap_request_id, reviewee_id, rating, feedback } = value;
  const reviewerId = req.user.id;

  // Validate swap request
  db.get('SELECT * FROM swap_requests WHERE id = ? AND status = "completed"', [swap_request_id], (err, swap) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!swap) {
      return res.status(400).json({ error: 'Swap request not found or not completed' });
    }

    // Check if reviewer was part of the swap
    if (swap.requester_id !== reviewerId && swap.provider_id !== reviewerId) {
      return res.status(403).json({ error: 'You can only review swaps you participated in' });
    }

    // Check if reviewee was part of the swap
    if (swap.requester_id !== reviewee_id && swap.provider_id !== reviewee_id) {
      return res.status(400).json({ error: 'Invalid reviewee' });
    }

    // Check if reviewer is not reviewing themselves
    if (reviewerId === reviewee_id) {
      return res.status(400).json({ error: 'You cannot review yourself' });
    }

    // Check if review already exists
    db.get('SELECT id FROM reviews WHERE swap_request_id = ? AND reviewer_id = ?', [swap_request_id, reviewerId], (err, existingReview) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this swap' });
      }

      // Create review
      db.run(
        'INSERT INTO reviews (swap_request_id, reviewer_id, reviewee_id, rating, feedback) VALUES (?, ?, ?, ?, ?)',
        [swap_request_id, reviewerId, reviewee_id, rating, feedback],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create review' });
          }

          res.status(201).json({
            message: 'Review created successfully',
            reviewId: this.lastID
          });
        }
      );
    });
  });
});

module.exports = router;
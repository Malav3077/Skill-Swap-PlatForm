const express = require('express');
const Joi = require('joi');
const db = require('../database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

const swapRequestSchema = Joi.object({
  provider_id: Joi.number().integer().required(),
  offered_skill_id: Joi.number().integer().required(),
  wanted_skill_id: Joi.number().integer().required(),
  message: Joi.string().max(500).optional()
});

// Get swap requests
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  let query = `
    SELECT sr.*,
           u1.name as requester_name, u1.photo as requester_photo,
           u2.name as provider_name, u2.photo as provider_photo,
           s1.title as offered_skill_title, s1.category as offered_skill_category,
           s2.title as wanted_skill_title, s2.category as wanted_skill_category
    FROM swap_requests sr
    JOIN users u1 ON sr.requester_id = u1.id
    JOIN users u2 ON sr.provider_id = u2.id
    JOIN skills s1 ON sr.offered_skill_id = s1.id
    JOIN skills s2 ON sr.wanted_skill_id = s2.id
    WHERE (sr.requester_id = ? OR sr.provider_id = ?)
  `;

  const params = [userId, userId];

  if (status) {
    query += ' AND sr.status = ?';
    params.push(status);
  }

  query += ' ORDER BY sr.created_at DESC';

  db.all(query, params, (err, swaps) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(swaps);
  });
});

// Create swap request
router.post('/', authenticateToken, (req, res) => {
  const { error, value } = swapRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { provider_id, offered_skill_id, wanted_skill_id, message } = value;
  const requesterId = req.user.id;

  // Validate that requester owns the offered skill
  db.get('SELECT user_id FROM skills WHERE id = ?', [offered_skill_id], (err, offeredSkill) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!offeredSkill || offeredSkill.user_id !== requesterId) {
      return res.status(400).json({ error: 'You can only offer your own skills' });
    }

    // Validate that provider owns the wanted skill
    db.get('SELECT user_id FROM skills WHERE id = ?', [wanted_skill_id], (err, wantedSkill) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!wantedSkill || wantedSkill.user_id !== provider_id) {
        return res.status(400).json({ error: 'Invalid wanted skill' });
      }

      // Create swap request
      db.run(
        'INSERT INTO swap_requests (requester_id, provider_id, offered_skill_id, wanted_skill_id, message) VALUES (?, ?, ?, ?, ?)',
        [requesterId, provider_id, offered_skill_id, wanted_skill_id, message],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create swap request' });
          }

          res.status(201).json({
            message: 'Swap request created successfully',
            swapId: this.lastID
          });
        }
      );
    });
  });
});

// Update swap request status
router.put('/:id/status', authenticateToken, (req, res) => {
  const swapId = req.params.id;
  const userId = req.user.id;
  const { status } = req.body;

  const validStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // Get swap request
  db.get('SELECT * FROM swap_requests WHERE id = ?', [swapId], (err, swap) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!swap) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    // Check authorization
    if (status === 'accepted' || status === 'rejected') {
      // Only provider can accept/reject
      if (swap.provider_id !== userId) {
        return res.status(403).json({ error: 'Only the provider can accept or reject requests' });
      }
    } else if (status === 'cancelled') {
      // Only requester can cancel
      if (swap.requester_id !== userId) {
        return res.status(403).json({ error: 'Only the requester can cancel requests' });
      }
    } else if (status === 'completed') {
      // Either party can mark as completed
      if (swap.requester_id !== userId && swap.provider_id !== userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    db.run(
      'UPDATE swap_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, swapId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update swap request' });
        }

        res.json({ message: 'Swap request updated successfully' });
      }
    );
  });
});

// Delete swap request
router.delete('/:id', authenticateToken, (req, res) => {
  const swapId = req.params.id;
  const userId = req.user.id;

  // Check if user owns the swap request
  db.get('SELECT requester_id FROM swap_requests WHERE id = ?', [swapId], (err, swap) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!swap) {
      return res.status(404).json({ error: 'Swap request not found' });
    }

    if (swap.requester_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this swap request' });
    }

    db.run('DELETE FROM swap_requests WHERE id = ?', [swapId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete swap request' });
      }

      res.json({ message: 'Swap request deleted successfully' });
    });
  });
});

module.exports = router;
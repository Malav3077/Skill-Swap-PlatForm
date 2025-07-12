const express = require('express');
const Joi = require('joi');
const db = require('../database.cjs');
const { authenticateToken } = require('../middleware/auth.cjs');

const router = express.Router();

const skillSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).optional(),
  category: Joi.string().required(),
  skill_type: Joi.string().valid('offered', 'wanted').required(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional()
});

// Get all skills with filters
router.get('/', authenticateToken, (req, res) => {
  const { category, skill_type, search, user_id } = req.query;
  
  let query = `
    SELECT s.*, u.name as user_name, u.photo as user_photo, u.location as user_location,
           u.id as user_id
    FROM skills s
    JOIN users u ON s.user_id = u.id
    WHERE 1=1
  `;
  
  const params = [];

  if (category) {
    query += ' AND s.category = ?';
    params.push(category);
  }

  if (skill_type) {
    query += ' AND s.skill_type = ?';
    params.push(skill_type);
  }

  if (search) {
    query += ' AND (s.title LIKE ? OR s.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (user_id) {
    query += ' AND s.user_id = ?';
    params.push(user_id);
  }

  query += ' ORDER BY s.created_at DESC';

  db.all(query, params, (err, skills) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(skills);
  });
});

// Get skill categories
router.get('/categories', authenticateToken, (req, res) => {
  db.all('SELECT DISTINCT category FROM skills ORDER BY category', (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(categories.map(c => c.category));
  });
});

// Create skill
router.post('/', authenticateToken, (req, res) => {
  const { error, value } = skillSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, description, category, skill_type, level } = value;
  const userId = req.user.id;

  db.run(
    'INSERT INTO skills (user_id, title, description, category, skill_type, level) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, title, description, category, skill_type, level],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create skill' });
      }

      res.status(201).json({
        message: 'Skill created successfully',
        skill: {
          id: this.lastID,
          user_id: userId,
          title,
          description,
          category,
          skill_type,
          level
        }
      });
    }
  );
});

// Update skill
router.put('/:id', authenticateToken, (req, res) => {
  const skillId = req.params.id;
  const userId = req.user.id;

  // Check if skill belongs to user
  db.get('SELECT user_id FROM skills WHERE id = ?', [skillId], (err, skill) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this skill' });
    }

    const { error, value } = skillSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, category, skill_type, level } = value;

    db.run(
      'UPDATE skills SET title = ?, description = ?, category = ?, skill_type = ?, level = ? WHERE id = ?',
      [title, description, category, skill_type, level, skillId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to update skill' });
        }

        res.json({ message: 'Skill updated successfully' });
      }
    );
  });
});

// Delete skill
router.delete('/:id', authenticateToken, (req, res) => {
  const skillId = req.params.id;
  const userId = req.user.id;

  // Check if skill belongs to user
  db.get('SELECT user_id FROM skills WHERE id = ?', [skillId], (err, skill) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    if (skill.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this skill' });
    }

    db.run('DELETE FROM skills WHERE id = ?', [skillId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete skill' });
      }

      res.json({ message: 'Skill deleted successfully' });
    });
  });
});

module.exports = router;
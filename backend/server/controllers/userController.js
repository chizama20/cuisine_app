const { query } = require('../config/db');

// Get user profile
const getProfile = async (req, res) => {
  const userId = req.user.userId;

  const sql = 'SELECT id, clientId, firstName, lastName, email, phone, address FROM users WHERE id = ?';

  try {
    const results = await query(sql, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const { firstName, lastName, phone, address } = req.body;

  const sql = 'UPDATE users SET firstName = ?, lastName = ?, phone = ?, address = ? WHERE id = ?';

  try {
    const result = await query(sql, [firstName, lastName, phone, address, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};

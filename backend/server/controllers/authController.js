const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/db');

// User registration
const register = async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    email,
    phone,
    password
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !address || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Generate unique client ID
    const clientId = uuidv4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const sql = 'INSERT INTO users (clientId, firstName, lastName, address, email, phone, password) VALUES (?, ?, ?, ?, ?, ?, ?)';

    await query(sql, [clientId, firstName, lastName, address, email, phone, hashedPassword]);

    res.status(201).json({
      message: 'User registered successfully',
      clientId: clientId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'User registration failed', error: error.message });
  }
};

// User login
const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Phone and password are required' });
  }

  try {
    // Query database for user by email or phone
    const sql = 'SELECT * FROM users WHERE email = ? OR phone = ?';
    const results = await query(sql, [identifier, identifier]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token (valid for 3 hours)
    const token = jwt.sign(
      { userId: user.id, clientId: user.clientId },
      process.env.JWT_SECRET,
      { expiresIn: '3h' }
    );

    // Send token and user info
    res.json({
      token,
      userId: user.id,
      user: {
        id: user.id,
        clientId: user.clientId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login
};

const express = require('express');
const router = express.Router();

// Hardcoded admin credentials (in production, use database and bcrypt)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // In production, this should be hashed
};

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          username: username
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint (optional, mainly for session-based auth)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;


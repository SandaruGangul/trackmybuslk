const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const fallbackAuth = require('../data/fallbackAuth');

const router = express.Router();

// Helper function to check if MongoDB is available
const isMongoAvailable = async () => {
  try {
    await User.findOne();
    return true;
  } catch (error) {
    console.log('MongoDB not available for auth, using fallback authentication');
    return false;
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('username').isLength({ min: 3 }).trim().withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').isMobilePhone().withMessage('Please include a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, phoneNumber } = req.body;
    const mongoAvailable = await isMongoAvailable();

    if (mongoAvailable) {
      // Use MongoDB
      const existingUser = await User.findOne({
        $or: [{ email }, { username }, { phoneNumber }]
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email, username, or phone number already exists' });
      }

      const user = new User({
        username,
        email,
        password,
        phoneNumber
      });

      await user.save();
      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user
      });
    } else {
      // Use fallback authentication
      try {
        const user = await fallbackAuth.createUser({ username, email, password, phoneNumber });
        const token = fallbackAuth.generateToken(user._id);

        res.status(201).json({
          message: 'User registered successfully (demo mode)',
          token,
          user
        });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please include a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: '***' });
    
    const mongoAvailable = await isMongoAvailable();
    console.log('MongoDB available:', mongoAvailable);

    if (mongoAvailable) {
      // Use MongoDB
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found in MongoDB');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Password does not match in MongoDB');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);
      res.json({
        message: 'Login successful',
        token,
        user
      });
    } else {
      // Use fallback authentication
      console.log('Using fallback authentication');
      console.log('Available fallback users:', require('../data/fallbackData').fallbackUsers.map(u => u.email));
      
      const user = fallbackAuth.findUserByEmail(email);
      if (!user) {
        console.log('User not found in fallback data:', email);
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      console.log('User found in fallback data:', user.email);

      const isMatch = await fallbackAuth.comparePassword(password, user.password);
      if (!isMatch) {
        console.log('Password does not match in fallback data');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      console.log('Password matches in fallback data');

      const token = fallbackAuth.generateToken(user._id);
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: 'Login successful (demo mode)',
        token,
        user: userWithoutPassword
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      const user = await User.findById(req.user._id);
      res.json({ user });
    } else {
      // Use fallback authentication
      const user = fallbackAuth.findUserById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
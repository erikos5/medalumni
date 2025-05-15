const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { users: mockUsers } = require('../../config/mockData');
const mongoose = require('mongoose');

// @route   GET api/auth
// @desc    Get user by token
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('Using mock user data');
      // Handle admin session
      if (req.user.email === 'admin@example.com') {
        const adminUser = {
          _id: 'admin-user-id',
          name: 'Administrator',
          email: 'admin@example.com',
          role: 'admin',
          date: new Date()
        };
        return res.json(adminUser);
      }
      
      const mockUser = mockUsers.find(user => user._id === req.user.id);
      if (!mockUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      return res.json(mockUser);
    }
    
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Special handling for admin login
    if (email === 'admin@example.com' && password === 'admin123') {
      const payload = {
        user: {
          id: 'admin-user-id',
          email: 'admin@example.com',
          role: 'admin'
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'mysecrettoken',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      return;
    }

    try {
      // Check if MongoDB is connected
      if (mongoose.connection.readyState !== 1) {
        console.log('Using mock user data for authentication');
        const mockUser = mockUsers.find(user => user.email === email);
        
        if (!mockUser) {
          return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        // For mock data, we'll accept any password
        const payload = {
          user: {
            id: mockUser._id,
            email: mockUser.email,
            role: mockUser.role || 'alumni'
          }
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET || 'mysecrettoken',
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
        return;
      }
    
      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'mysecrettoken',
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
        role: 'appliedAlumni' // Default role for new registrations
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; 
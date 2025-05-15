const express = require('express');
const router = express.Router();

// Import routes
const authRoutes = require('./api/auth');
const profilesRoutes = require('./api/profiles');
const schoolsRoutes = require('./api/schools');

// Define routes
router.use('/auth', authRoutes);
router.use('/profiles', profilesRoutes);
router.use('/schools', schoolsRoutes);

module.exports = router; 
const User = require('../models/User');
const mongoose = require('mongoose');

module.exports = async function(req, res, next) {
  try {
    console.log('isAdmin middleware - User data:', JSON.stringify(req.user));
    
    // For all MongoDB operations, make sure to be tolerant of MongoDB ObjectId / string ID format differences
    let userId = req.user.id || req.user._id;
    console.log('Looking up admin status for user ID:', userId);
    
    // Convert userId to string if it's not already
    if (userId && typeof userId !== 'string') {
      userId = String(userId);
    }
    
    console.log('Checking database for admin user with ID:', userId);
    
    // Find user by ID
    let user = await User.findById(userId).catch(err => {
      console.log('Error finding user by ID:', err.message);
      return null;
    });

    // Check if user exists
    if (!user) {
      console.log('Admin access denied: database user not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      console.log('Admin access denied: database user is not admin, role =', user.role);
      return res.status(403).json({ msg: 'Access denied. Admin access required' });
    }

    console.log('Admin access granted: database admin user');
    next();
  } catch (err) {
    console.error('Admin middleware error:', err.message);
    console.error(err.stack);
    res.status(500).json({
      msg: 'Server Error',
      error: err.message
    });
  }
}; 
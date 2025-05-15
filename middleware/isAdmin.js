const User = require('../models/User');
const { users: mockUsers } = require('../config/mockData');
const mongoose = require('mongoose');

module.exports = async function(req, res, next) {
  try {
    // Special handling for hardcoded admin user
    if (req.user.id === 'admin-user-id' || req.user.role === 'admin') {
      return next();
    }
    
    // Check if using mock data
    if (mongoose.connection.readyState !== 1) {
      const mockUser = mockUsers.find(user => user._id === req.user.id);
      if (!mockUser) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      if (mockUser.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admin access required' });
      }
      
      return next();
    }
    
    const user = await User.findById(req.user.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin access required' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 
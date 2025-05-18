const User = require('../models/User');
const { users: mockUsers } = require('../config/mockData');
const mongoose = require('mongoose');

module.exports = async function(req, res, next) {
  try {
    console.log('isAdmin middleware - User data:', req.user);
    
    // Special handling for hardcoded admin user
    if (req.user.id === 'admin-user-id' || req.user.email === 'admin@example.com' || req.user.role === 'admin') {
      console.log('Admin access granted: admin user identified');
      return next();
    }
    
    // Check if using mock data
    if (mongoose.connection.readyState !== 1) {
      console.log('Using mock data for admin check');
      const mockUser = mockUsers.find(user => user._id === req.user.id);
      if (!mockUser) {
        console.log('Admin access denied: mock user not found');
        return res.status(404).json({ msg: 'User not found' });
      }
      
      if (mockUser.role !== 'admin') {
        console.log('Admin access denied: mock user is not admin');
        return res.status(403).json({ msg: 'Access denied. Admin access required' });
      }
      
      console.log('Admin access granted: mock admin user');
      return next();
    }
    
    console.log('Checking database for admin user with ID:', req.user.id);
    const user = await User.findById(req.user.id);

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
    res.status(500).send('Server Error');
  }
}; 
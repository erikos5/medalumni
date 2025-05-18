const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  const adminToken = req.header('x-admin-token');
  
  console.log('Auth middleware - Token present:', !!token);
  console.log('Auth middleware - Admin token present:', !!adminToken);
  
  // Check if no token
  if (!token) {
    console.log('Auth denied: No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Get JWT secret
  const jwtSecret = process.env.JWT_SECRET || 'mysecrettoken';
  console.log('Using JWT secret:', jwtSecret.substring(0, 3) + '...');

  // Verify token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token verified for user:', decoded.user.email);
    
    req.user = decoded.user;
    
    // For admin routes with x-admin-token, add additional verification
    if (adminToken && req.user.role === 'admin') {
      console.log('Admin token present and user is admin');
      
      // Verify the admin user exists in database
      try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
          console.log('Admin verification failed: user not found or not admin');
          return res.status(401).json({ msg: 'Admin verification failed' });
        }
        console.log('Admin user verified in database');
      } catch (dbErr) {
        console.error('Database error during admin verification:', dbErr.message);
        // If database check fails but token is valid, still allow access
        // This is a fallback for maintenance/development
        console.log('Warning: Using token-only verification for admin');
      }
    }
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}; 
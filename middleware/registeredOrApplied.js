const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if user is registeredAlumni or appliedAlumni
    if (user.role !== 'registeredAlumni' && user.role !== 'appliedAlumni' && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Registered or applied alumni access required' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 
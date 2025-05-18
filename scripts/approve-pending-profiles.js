const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/mediterranean-alumni';
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected: ' + mongoose.connection.host);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const approvePendingProfiles = async () => {
  try {
    await connectDB();
    
    // Get all pending profiles
    const pendingProfiles = await Profile.find({ status: 'pending' }).populate('user', ['name', 'email', 'role']);
    console.log(`\nFound ${pendingProfiles.length} pending profiles`);
    
    if (pendingProfiles.length === 0) {
      console.log('No pending profiles to approve.');
      mongoose.disconnect();
      return;
    }
    
    // Approve each pending profile
    for (const profile of pendingProfiles) {
      console.log(`Approving profile for: ${profile.user ? profile.user.name : 'Unknown user'}`);
      
      // Update profile status to approved
      await Profile.findByIdAndUpdate(
        profile._id,
        { $set: { status: 'approved' } }
      );
      
      // Update user role to registeredAlumni
      if (profile.user && profile.user._id) {
        await User.findByIdAndUpdate(
          profile.user._id,
          { $set: { role: 'registeredAlumni' } }
        );
        console.log(`Updated user role for ${profile.user.name} to registeredAlumni`);
      }
    }
    
    console.log(`\nApproved ${pendingProfiles.length} profiles. All users should now appear in the alumni directory.`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
};

approvePendingProfiles(); 
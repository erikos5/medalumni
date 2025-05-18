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

const removeMockProfiles = async () => {
  try {
    await connectDB();
    
    // Identify mock users (John Doe and Jane Smith with specific IDs from mock data)
    const mockUserIds = [
      '5f8f8c8f8c8f8c8f8c8f8c9f', // John Doe
      '5f8f8c8f8c8f8c8f8c8f8c9e'  // Jane Smith
    ];
    
    console.log('\nLooking for mock users with IDs:', mockUserIds);
    
    // First find and delete their profiles
    const profileDeleteResult = await Profile.deleteMany({
      user: { $in: mockUserIds.map(id => mongoose.Types.ObjectId.createFromHexString(id)) }
    });
    
    console.log(`Deleted ${profileDeleteResult.deletedCount} mock profiles`);
    
    // Then delete the mock users
    const userDeleteResult = await User.deleteMany({
      _id: { $in: mockUserIds.map(id => mongoose.Types.ObjectId.createFromHexString(id)) }
    });
    
    console.log(`Deleted ${userDeleteResult.deletedCount} mock users`);
    
    // Verify all users are now real
    const remainingUsers = await User.find().select('name email role');
    console.log('\nRemaining users in database:', remainingUsers.length);
    remainingUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}), Role: ${user.role}`);
    });
    
    // Check remaining profiles
    const remainingProfiles = await Profile.find().populate('user', ['name', 'email']);
    console.log('\nRemaining profiles in database:', remainingProfiles.length);
    remainingProfiles.forEach(profile => {
      const userName = profile.user ? profile.user.name : 'Unknown User';
      const userEmail = profile.user ? profile.user.email : 'No Email';
      console.log(`- Profile for ${userName} (${userEmail})`);
    });
    
    console.log('\nMock data cleanup complete');
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
};

removeMockProfiles(); 
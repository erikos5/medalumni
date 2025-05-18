const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const School = require('../models/School');

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

const checkProfiles = async () => {
  try {
    await connectDB();
    
    // Get all users
    const users = await User.find().select('-password');
    console.log('\nUsers in database:', users.length);
    users.forEach(user => {
      console.log(`- User: ${user.name}, Email: ${user.email}, Role: ${user.role}, ID: ${user._id}`);
    });
    
    // Get all profiles, handle potential school population issues
    let profiles = [];
    try {
      profiles = await Profile.find().populate('user', ['name', 'email', 'role']).populate('school', ['name']);
    } catch (err) {
      console.error('Error populating school in profiles:', err.message);
      profiles = await Profile.find().populate('user', ['name', 'email', 'role']);
    }
    
    console.log('\nProfiles in database:', profiles.length);
    profiles.forEach(profile => {
      console.log(`- Profile ID: ${profile._id}`);
      console.log(`  User: ${profile.user ? profile.user.name : 'No user'}`);
      console.log(`  Email: ${profile.user ? profile.user.email : 'No email'}`);
      console.log(`  Role: ${profile.user ? profile.user.role : 'No role'}`);
      console.log(`  School: ${profile.school ? (typeof profile.school === 'object' ? profile.school.name : profile.school) : 'No school'}`);
      console.log(`  Status: ${profile.status}`);
      console.log('---');
    });
    
    // Check for users without profiles
    const usersWithoutProfiles = [];
    for (const user of users) {
      const hasProfile = profiles.some(profile => 
        profile.user && profile.user._id.toString() === user._id.toString()
      );
      if (!hasProfile && user.role !== 'admin') {
        usersWithoutProfiles.push(user);
      }
    }
    
    console.log('\nUsers without profiles:', usersWithoutProfiles.length);
    usersWithoutProfiles.forEach(user => {
      console.log(`- ${user.name} (${user.email}), Role: ${user.role}`);
    });
    
    // Check for "appliedAlumni" users without pending profiles
    const appliedAlumniWithoutPendingProfiles = users.filter(user => 
      user.role === 'appliedAlumni' && 
      !profiles.some(profile => 
        profile.user && 
        profile.user._id.toString() === user._id.toString() && 
        profile.status === 'pending'
      )
    );
    
    console.log('\nappliedAlumni users without pending profiles:', appliedAlumniWithoutPendingProfiles.length);
    appliedAlumniWithoutPendingProfiles.forEach(user => {
      console.log(`- ${user.name} (${user.email})`);
    });
    
    mongoose.disconnect();
    console.log('\nDatabase check complete');
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
};

checkProfiles(); 
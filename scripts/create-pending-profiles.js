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

const createPendingProfiles = async () => {
  try {
    await connectDB();
    
    // Get all users
    const users = await User.find({role: 'appliedAlumni'}).select('-password');
    console.log('\nApplied Alumni users in database:', users.length);
    
    // Get all schools to use the first one as default
    const schools = await School.find();
    if (schools.length === 0) {
      console.error('No schools found in database. Creating a default school.');
      const defaultSchool = new School({
        name: 'School of Business',
        description: 'Default school created for testing purposes'
      });
      await defaultSchool.save();
      schools.push(defaultSchool);
    }
    
    const defaultSchool = schools[0];
    console.log(`Using default school: ${defaultSchool.name} (${defaultSchool._id})`);
    
    // Get existing profiles
    const profiles = await Profile.find();
    console.log('Existing profiles:', profiles.length);
    
    // Create pending profiles for users that don't have one
    let created = 0;
    let skipped = 0;
    
    for (const user of users) {
      // Check if user already has a profile
      const hasProfile = profiles.some(profile => 
        profile.user && profile.user.toString() === user._id.toString()
      );
      
      if (!hasProfile) {
        console.log(`Creating pending profile for ${user.name} (${user.email})`);
        
        // Create a new pending profile
        const newProfile = new Profile({
          user: user._id,
          school: defaultSchool._id,
          graduationYear: new Date().getFullYear(),
          degree: 'Pending Degree Information',
          status: 'pending'
        });
        
        await newProfile.save();
        created++;
      } else {
        console.log(`User ${user.name} already has a profile. Skipping.`);
        skipped++;
      }
    }
    
    console.log(`\nOperation complete. Created ${created} pending profiles. Skipped ${skipped} users.`);
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
};

createPendingProfiles(); 
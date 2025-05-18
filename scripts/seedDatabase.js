const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const { schools, users, profiles, events } = require('../config/mockData'); // Mock data no longer used
const School = require('../models/School');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Event = require('../models/Event');

// Load environment variables
dotenv.config();

console.log('\n⚠️  DEPRECATED: This seed script is no longer recommended for use ⚠️');
console.log('The application now uses real user data and the mock data has been removed.');
console.log('Using this script would reintroduce mock data which has been intentionally removed.');
console.log('If you need to add test data, consider creating real users and profiles instead.\n');

console.log('To add a new admin user, use:');
console.log('  node scripts/create-admin-user.js\n');

console.log('To add pending profiles, use:');
console.log('  node scripts/create-pending-profiles.js\n');

console.log('To approve pending profiles, use:');
console.log('  node scripts/approve-pending-profiles.js\n');

process.exit(0);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediterranean-alumni';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

// Seed the database with initial data
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await School.deleteMany({});
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Event.deleteMany({});

    console.log('Cleared existing data');

    // Insert schools
    const createdSchools = await School.insertMany(schools);
    console.log(`Inserted ${createdSchools.length} schools`);

    // Insert users with hashed password and corrected roles
    const bcrypt = require('bcryptjs');

    // Process users one by one to hash passwords and fix roles
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      // Map 'alumni' role to 'registeredAlumni' since 'alumni' is not a valid role
      const correctedRole = user.role === 'alumni' ? 'registeredAlumni' : user.role;
      
      await User.create({
        ...user,
        password: hashedPassword,
        role: correctedRole
      });
    }
    console.log(`Inserted ${users.length} users`);

    // Map profile data to reference actual document IDs
    const insertedUsers = await User.find({});
    const insertedSchools = await School.find({});

    // Create a map of mock IDs to actual MongoDB IDs
    const userIdMap = {};
    const schoolIdMap = {};

    insertedUsers.forEach((user, index) => {
      userIdMap[users[index]._id] = user._id;
    });

    insertedSchools.forEach((school, index) => {
      schoolIdMap[schools[index]._id] = school._id;
    });

    // Prepare profiles with actual MongoDB IDs
    const profilesWithRealIds = profiles.map(profile => {
      const userId = userIdMap[profile.user._id];
      const schoolId = schoolIdMap[profile.school._id];
      
      return {
        ...profile,
        user: userId,
        school: schoolId,
        _id: undefined  // Let MongoDB generate a new ID
      };
    });

    // Insert profiles
    const createdProfiles = await Profile.insertMany(profilesWithRealIds);
    console.log(`Inserted ${createdProfiles.length} profiles`);

    // Prepare events with actual user IDs for createdBy
    const eventsWithRealIds = events.map(event => {
      const createdById = event.createdBy ? userIdMap[event.createdBy] : undefined;
      
      return {
        ...event,
        createdBy: createdById,
        _id: undefined  // Let MongoDB generate a new ID
      };
    });

    // Insert events
    const createdEvents = await Event.insertMany(eventsWithRealIds);
    console.log(`Inserted ${createdEvents.length} events`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase(); 
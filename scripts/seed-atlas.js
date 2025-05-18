/**
 * MongoDB Atlas Seed Script
 * 
 * This script directly seeds your MongoDB Atlas database with essential data
 * including admin user, default schools, and an initial profile.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Get MongoDB Atlas connection string
const getConnectionString = () => {
  let uri = process.argv[2];
  if (!uri) {
    console.error('Please provide the MongoDB Atlas connection string as an argument:');
    console.error('node scripts/seed-atlas.js "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"');
    process.exit(1);
  }
  return uri;
};

// Connect to MongoDB Atlas
const connectToAtlas = async (uri) => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas successfully.');
  } catch (err) {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  }
};

// Define models
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'appliedAlumni',
    enum: ['admin', 'alumni', 'appliedAlumni', 'visitor']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school'
  },
  program: {
    type: String
  },
  programType: {
    type: String,
    enum: ['undergraduate', 'postgraduate', 'professional']
  },
  graduationYear: {
    type: Number
  },
  bio: {
    type: String
  },
  location: {
    type: String
  },
  company: {
    type: String
  },
  position: {
    type: String
  },
  website: {
    type: String
  },
  social: {
    linkedin: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  programs: {
    undergraduate: [String],
    postgraduate: [String],
    professional: [String]
  }
});

const User = mongoose.model('user', UserSchema);
const Profile = mongoose.model('profile', ProfileSchema);
const School = mongoose.model('school', SchoolSchema);

// Seed admin user
const seedAdminUser = async () => {
  try {
    console.log('\nSeeding admin user...');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('  - Admin user already exists');
      return existingAdmin;
    }
    
    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    await admin.save();
    console.log('  - Admin user created successfully');
    return admin;
  } catch (err) {
    console.error('Error seeding admin user:', err);
    return null;
  }
};

// Seed user account
const seedUserAccount = async () => {
  try {
    console.log('\nSeeding regular user account...');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'yannos@example.com' });
    if (existingUser) {
      console.log('  - Regular user already exists');
      return existingUser;
    }
    
    // Create regular user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const user = new User({
      name: 'Yannos Alumni',
      email: 'yannos@example.com',
      password: hashedPassword,
      role: 'alumni'
    });
    
    await user.save();
    console.log('  - Regular user created successfully');
    return user;
  } catch (err) {
    console.error('Error seeding regular user:', err);
    return null;
  }
};

// Seed default school
const seedDefaultSchool = async () => {
  try {
    console.log('\nSeeding default school...');
    
    // Check if school already exists
    const existingSchool = await School.findOne();
    if (existingSchool) {
      console.log('  - School already exists');
      return existingSchool;
    }
    
    // Create default school
    const school = new School({
      name: 'School of Business',
      description: 'The School of Business offers programs in business administration, marketing, finance, and more.',
      programs: {
        undergraduate: ['Business Administration', 'Marketing', 'Finance', 'Accounting'],
        postgraduate: ['MBA', 'MSc in Finance', 'MSc in Marketing', 'MSc in Human Resources'],
        professional: ['Certificate in Business Management', 'Certificate in Digital Marketing']
      }
    });
    
    await school.save();
    console.log('  - Default school created successfully');
    return school;
  } catch (err) {
    console.error('Error seeding default school:', err);
    return null;
  }
};

// Seed user profile
const seedUserProfile = async (user, school) => {
  try {
    console.log('\nSeeding user profile...');
    
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: user._id });
    if (existingProfile) {
      console.log('  - User profile already exists');
      return existingProfile;
    }
    
    // Create profile
    const profile = new Profile({
      user: user._id,
      status: 'approved',
      firstName: 'Yannos',
      lastName: 'Alumni',
      school: school._id,
      program: 'Business Administration',
      programType: 'undergraduate',
      graduationYear: 2020,
      bio: 'Graduate from the School of Business with a degree in Business Administration.',
      location: 'Athens, Greece',
      company: 'Mediterranean College',
      position: 'Alumni Coordinator',
      social: {
        linkedin: 'https://linkedin.com/in/yannos',
        facebook: 'https://facebook.com/yannos'
      }
    });
    
    await profile.save();
    console.log('  - User profile created successfully');
    return profile;
  } catch (err) {
    console.error('Error seeding user profile:', err);
    return null;
  }
};

// Main function
const seedDatabase = async () => {
  const uri = getConnectionString();
  await connectToAtlas(uri);
  
  try {
    // Seed essential data
    const admin = await seedAdminUser();
    const user = await seedUserAccount();
    const school = await seedDefaultSchool();
    
    // Create profiles if users and school were created successfully
    if (user && school) {
      await seedUserProfile(user, school);
    }
    
    console.log('\nDatabase seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run the seed
seedDatabase(); 
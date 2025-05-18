const mongoose = require('mongoose');
const config = require('config');
const dotenv = require('dotenv');

dotenv.config();

// Load School model
const School = require('../models/School');

// MongoDB connection string
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni';

// Sample school data to seed
const schoolSeedData = [
  {
    name: 'School of Maritime Studies',
    description: 'The School of Maritime Studies at Mediterranean College offers world-class education in maritime affairs.',
    image: 'https://example.com/maritime.jpg',
    programs: {
      undergraduate: ['BSc Maritime Studies', 'BSc International Maritime Management'],
      postgraduate: ['MSc Maritime Studies', 'MBA Maritime Management'],
      professional: ['Diploma in Maritime Operations', 'Certificate in Shipping Management']
    }
  },
  {
    name: 'School of Business',
    description: 'The School of Business at Mediterranean College prepares future leaders in business and management.',
    image: 'https://example.com/business.jpg',
    programs: {
      undergraduate: ['BA (Hons) Business Management', 'BSc Accounting and Finance'],
      postgraduate: ['MBA', 'MSc Marketing Management', 'MSc Human Resource Management'],
      professional: ['Diploma in Business Administration', 'Certificate in Digital Marketing']
    }
  },
  {
    name: 'School of Computing',
    description: 'The School of Computing at Mediterranean College offers cutting-edge programs in computer science and technology.',
    image: 'https://example.com/computing.jpg',
    programs: {
      undergraduate: ['BSc Computer Science', 'BSc Information Technology'],
      postgraduate: ['MSc Computer Science', 'MSc Data Science', 'MSc Cybersecurity'],
      professional: ['Diploma in Web Development', 'Certificate in Programming']
    }
  },
  {
    name: 'School of Engineering',
    description: 'The School of Engineering at Mediterranean College provides practical and theoretical knowledge in engineering disciplines.',
    image: 'https://example.com/engineering.jpg',
    programs: {
      undergraduate: ['BEng Civil Engineering', 'BEng Mechanical Engineering'],
      postgraduate: ['MSc Civil Engineering', 'MSc Engineering Management'],
      professional: ['Diploma in Construction', 'Certificate in CAD']
    }
  }
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');

    // First delete all existing schools
    await School.deleteMany({});
    console.log('Deleted existing schools data');

    // Insert the new schools
    await School.insertMany(schoolSeedData);
    console.log('Schools data seeded successfully');

    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('MongoDB Disconnected...');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 
/**
 * Comprehensive MongoDB Atlas Seed Script
 * 
 * This script creates a rich dataset in your MongoDB Atlas database including:
 * - Multiple user accounts with different roles
 * - Multiple schools with comprehensive program listings
 * - Events with various dates and categories
 * - Detailed alumni profiles with complete information
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
    console.error('node scripts/seed-full-data.js "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"');
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

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Networking', 'Career', 'Social', 'Educational', 'Other'],
    default: 'Other'
  },
  organizer: {
    type: String
  },
  imageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('user', UserSchema);
const Profile = mongoose.model('profile', ProfileSchema);
const School = mongoose.model('school', SchoolSchema);
const Event = mongoose.model('event', EventSchema);

// Create a hashed password
const createHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Seed users
const seedUsers = async () => {
  console.log('\nSeeding users...');
  
  // Delete all existing users to ensure a fresh set
  await User.deleteMany({});
  console.log('  - Cleared existing users');
  
  const defaultPassword = await createHashedPassword('password123');
  
  const users = [
    // Admin
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: defaultPassword,
      role: 'admin'
    },
    // Approved Alumni
    {
      name: 'Yannos Papadopoulos',
      email: 'yannos@example.com',
      password: defaultPassword,
      role: 'alumni'
    },
    {
      name: 'Maria Nikolaou',
      email: 'maria@example.com',
      password: defaultPassword,
      role: 'alumni'
    },
    {
      name: 'Dimitris Alexiou',
      email: 'dimitris@example.com',
      password: defaultPassword,
      role: 'alumni'
    },
    // Pending Alumni Applications
    {
      name: 'Eleni Papadaki',
      email: 'eleni@example.com',
      password: defaultPassword,
      role: 'appliedAlumni'
    },
    {
      name: 'Nikos Georgiou',
      email: 'nikos@example.com',
      password: defaultPassword,
      role: 'appliedAlumni'
    },
    // Regular visitors
    {
      name: 'Sophia Karagianni',
      email: 'sophia@example.com',
      password: defaultPassword,
      role: 'visitor'
    }
  ];
  
  const createdUsers = await User.insertMany(users);
  console.log(`  - Created ${createdUsers.length} users`);
  return createdUsers;
};

// Seed schools
const seedSchools = async () => {
  console.log('\nSeeding schools...');
  
  // Delete all existing schools to ensure a fresh set
  await School.deleteMany({});
  console.log('  - Cleared existing schools');
  
  const schools = [
    {
      name: 'School of Business',
      description: 'The School of Business offers programs in business administration, marketing, finance, and more.',
      programs: {
        undergraduate: ['Business Administration', 'Marketing', 'Finance', 'Accounting', 'Human Resource Management'],
        postgraduate: ['MBA', 'MSc in Finance', 'MSc in Marketing', 'MSc in Human Resources', 'MSc in Project Management'],
        professional: ['Certificate in Business Management', 'Certificate in Digital Marketing', 'Certificate in Financial Analysis']
      }
    },
    {
      name: 'School of Computing',
      description: 'The School of Computing offers programs in computer science, software engineering, cybersecurity, and more.',
      programs: {
        undergraduate: ['Computer Science', 'Software Engineering', 'Web Development', 'Information Technology'],
        postgraduate: ['MSc in Computer Science', 'MSc in Cybersecurity', 'MSc in Artificial Intelligence', 'MSc in Data Science'],
        professional: ['Certificate in Web Development', 'Certificate in Network Administration', 'Certificate in Cloud Computing']
      }
    },
    {
      name: 'School of Health Sciences',
      description: 'The School of Health Sciences offers programs in psychology, physiotherapy, speech therapy, and more.',
      programs: {
        undergraduate: ['Psychology', 'Physiotherapy', 'Speech Therapy', 'Occupational Therapy'],
        postgraduate: ['MSc in Clinical Psychology', 'MSc in Cognitive Psychology', 'MSc in Physical Rehabilitation'],
        professional: ['Certificate in Counseling', 'Certificate in Sports Rehabilitation', 'Certificate in Mental Health Support']
      }
    },
    {
      name: 'School of Engineering',
      description: 'The School of Engineering offers programs in civil engineering, mechanical engineering, electrical engineering, and more.',
      programs: {
        undergraduate: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Architecture'],
        postgraduate: ['MSc in Structural Engineering', 'MSc in Sustainable Design', 'MSc in Energy Systems'],
        professional: ['Certificate in AutoCAD', 'Certificate in Construction Management', 'Certificate in Renewable Energy']
      }
    }
  ];
  
  const createdSchools = await School.insertMany(schools);
  console.log(`  - Created ${createdSchools.length} schools`);
  return createdSchools;
};

// Seed profiles
const seedProfiles = async (users, schools) => {
  console.log('\nSeeding profiles...');
  
  // Delete all existing profiles to ensure a fresh set
  await Profile.deleteMany({});
  console.log('  - Cleared existing profiles');
  
  // Skip admin user (first in the array) when creating profiles
  const nonAdminUsers = users.filter(user => user.role !== 'admin');
  const businessSchool = schools.find(school => school.name === 'School of Business');
  const computingSchool = schools.find(school => school.name === 'School of Computing');
  const healthSchool = schools.find(school => school.name === 'School of Health Sciences');
  const engineeringSchool = schools.find(school => school.name === 'School of Engineering');
  
  const profiles = [
    // Approved alumni
    {
      user: nonAdminUsers[0]._id, // Yannos
      status: 'approved',
      firstName: 'Yannos',
      lastName: 'Papadopoulos',
      school: businessSchool._id,
      program: 'Business Administration',
      programType: 'undergraduate',
      graduationYear: 2020,
      bio: 'Graduate from the School of Business with a degree in Business Administration. Currently working as Alumni Coordinator at Mediterranean College.',
      location: 'Athens, Greece',
      company: 'Mediterranean College',
      position: 'Alumni Coordinator',
      website: 'https://yannos-portfolio.com',
      social: {
        linkedin: 'https://linkedin.com/in/yannos',
        facebook: 'https://facebook.com/yannos',
        twitter: 'https://twitter.com/yannos',
        instagram: 'https://instagram.com/yannos'
      }
    },
    {
      user: nonAdminUsers[1]._id, // Maria
      status: 'approved',
      firstName: 'Maria',
      lastName: 'Nikolaou',
      school: computingSchool._id,
      program: 'Computer Science',
      programType: 'undergraduate',
      graduationYear: 2019,
      bio: 'Software developer with a passion for web technologies. Mediterranean College graduate with honors.',
      location: 'Thessaloniki, Greece',
      company: 'Tech Innovations',
      position: 'Full Stack Developer',
      website: 'https://maria-nikolaou.dev',
      social: {
        linkedin: 'https://linkedin.com/in/maria-nikolaou',
        github: 'https://github.com/maria-nikolaou'
      }
    },
    {
      user: nonAdminUsers[2]._id, // Dimitris
      status: 'approved',
      firstName: 'Dimitris',
      lastName: 'Alexiou',
      school: engineeringSchool._id,
      program: 'Civil Engineering',
      programType: 'postgraduate',
      graduationYear: 2021,
      bio: 'Civil engineer specializing in sustainable urban development. MSc graduate from Mediterranean College.',
      location: 'Patras, Greece',
      company: 'Urban Planners Co.',
      position: 'Senior Engineer',
      social: {
        linkedin: 'https://linkedin.com/in/dimitris-alexiou'
      }
    },
    // Pending alumni applications
    {
      user: nonAdminUsers[3]._id, // Eleni
      status: 'pending',
      firstName: 'Eleni',
      lastName: 'Papadaki',
      school: healthSchool._id,
      program: 'Psychology',
      programType: 'undergraduate',
      graduationYear: 2022,
      bio: 'Recent graduate in Psychology looking to connect with fellow alumni.',
      location: 'Athens, Greece',
      company: 'Wellness Center',
      position: 'Junior Therapist',
      social: {
        facebook: 'https://facebook.com/eleni.papadaki'
      }
    },
    {
      user: nonAdminUsers[4]._id, // Nikos
      status: 'pending',
      firstName: 'Nikos',
      lastName: 'Georgiou',
      school: businessSchool._id,
      program: 'Marketing',
      programType: 'postgraduate',
      graduationYear: 2023,
      bio: 'Marketing professional with an MSc in Marketing from Mediterranean College.',
      location: 'Athens, Greece',
      company: 'Digital Media Agency',
      position: 'Marketing Specialist',
      social: {
        linkedin: 'https://linkedin.com/in/nikos-georgiou',
        instagram: 'https://instagram.com/nikos.marketing'
      }
    }
    // No profile for visitor (Sophia)
  ];
  
  const createdProfiles = await Profile.insertMany(profiles);
  console.log(`  - Created ${createdProfiles.length} profiles`);
  return createdProfiles;
};

// Seed events
const seedEvents = async (adminUser) => {
  console.log('\nSeeding events...');
  
  // Delete all existing events to ensure a fresh set
  await Event.deleteMany({});
  console.log('  - Cleared existing events');
  
  // Create dates for events (future dates)
  const today = new Date();
  const futureDate1 = new Date(today);
  futureDate1.setDate(today.getDate() + 15);
  
  const futureDate2 = new Date(today);
  futureDate2.setDate(today.getDate() + 30);
  
  const futureDate3 = new Date(today);
  futureDate3.setDate(today.getDate() + 45);
  
  const futureDate4 = new Date(today);
  futureDate4.setDate(today.getDate() + 60);
  
  // Create past dates for events history
  const pastDate1 = new Date(today);
  pastDate1.setDate(today.getDate() - 30);
  
  const pastDate2 = new Date(today);
  pastDate2.setDate(today.getDate() - 60);
  
  const events = [
    {
      title: 'Annual Alumni Reunion',
      description: 'Join us for the annual Mediterranean College alumni reunion. Network with former classmates, meet new graduates, and hear about the latest developments at the college.',
      date: futureDate1,
      time: '18:00',
      location: 'Mediterranean College Main Campus, Athens',
      category: 'Networking',
      organizer: 'Alumni Association',
      imageUrl: '/uploads/events/reunion2023.jpg',
      createdBy: adminUser._id,
      attendees: []
    },
    {
      title: 'Career Fair 2023',
      description: 'Connect with top employers in various industries. Bring your resume and be prepared for on-the-spot interviews. Open to all alumni.',
      date: futureDate2,
      time: '10:00',
      location: 'Mediterranean College Conference Center, Thessaloniki',
      category: 'Career',
      organizer: 'Career Services Office',
      imageUrl: '/uploads/events/careerfair2023.jpg',
      createdBy: adminUser._id,
      attendees: []
    },
    {
      title: 'Digital Transformation Workshop',
      description: 'Learn about the latest digital technologies and how they are transforming businesses. This hands-on workshop will cover AI, blockchain, and data analytics.',
      date: futureDate3,
      time: '14:00',
      location: 'Online (Zoom)',
      category: 'Educational',
      organizer: 'School of Computing',
      imageUrl: '/uploads/events/digitalworkshop.jpg',
      createdBy: adminUser._id,
      attendees: []
    },
    {
      title: 'Summer Beach Party',
      description: 'Relax and socialize with fellow alumni at our annual beach party. Food, drinks, and entertainment provided.',
      date: futureDate4,
      time: '16:00',
      location: 'Glyfada Beach, Athens',
      category: 'Social',
      organizer: 'Alumni Social Committee',
      imageUrl: '/uploads/events/beachparty.jpg',
      createdBy: adminUser._id,
      attendees: []
    },
    {
      title: 'Leadership Seminar',
      description: 'Past event: A seminar on effective leadership strategies in the modern workplace.',
      date: pastDate1,
      time: '17:30',
      location: 'Mediterranean College, Room 301',
      category: 'Educational',
      organizer: 'School of Business',
      imageUrl: '/uploads/events/leadership.jpg',
      createdBy: adminUser._id,
      attendees: []
    },
    {
      title: 'Alumni Basketball Tournament',
      description: 'Past event: Annual basketball tournament between alumni teams from different graduation years.',
      date: pastDate2,
      time: '12:00',
      location: 'Mediterranean College Sports Center',
      category: 'Social',
      organizer: 'Athletics Department',
      imageUrl: '/uploads/events/basketball.jpg',
      createdBy: adminUser._id,
      attendees: []
    }
  ];
  
  const createdEvents = await Event.insertMany(events);
  console.log(`  - Created ${createdEvents.length} events`);
  return createdEvents;
};

// Main function to seed all data
const seedFullDatabase = async () => {
  const uri = getConnectionString();
  await connectToAtlas(uri);
  
  try {
    // Seed all data in order (users → schools → profiles → events)
    const users = await seedUsers();
    const schools = await seedSchools();
    
    // Get admin user for creating events
    const adminUser = users.find(user => user.role === 'admin');
    
    await seedProfiles(users, schools);
    await seedEvents(adminUser);
    
    console.log('\nFull database seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Alumni User: yannos@example.com / password123');
    console.log('Pending User: eleni@example.com / password123');
    console.log('Visitor: sophia@example.com / password123');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // Close connection
    mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
};

// Run the seed
seedFullDatabase(); 
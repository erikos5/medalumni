const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Set default test credentials or use command line arguments
const testEmail = process.argv[2] || 'admin@example.com';
const testPassword = process.argv[3] || 'password123';

async function verifyLogin() {
  try {
    // Read MongoDB Atlas URI
    const atlasUriPath = path.join(__dirname, '..', 'mongodb-atlas-uri.txt');
    let mongoURI;
    
    if (fs.existsSync(atlasUriPath)) {
      mongoURI = fs.readFileSync(atlasUriPath, 'utf8').trim();
      console.log('Using MongoDB Atlas URI from file');
    } else {
      mongoURI = process.env.MONGO_URI;
      console.log('Using MongoDB Atlas URI from environment variable');
    }
    
    if (!mongoURI) {
      console.error('Error: No MongoDB connection string found!');
      process.exit(1);
    }

    console.log(`Connecting to MongoDB Atlas...`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');
    
    // Define User schema to match your application's User model
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
        default: 'appliedAlumni'
      },
      date: {
        type: Date,
        default: Date.now
      }
    });

    const User = mongoose.model('User', UserSchema);
    
    // Try to find the user
    console.log(`\nTesting login for: ${testEmail}`);
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.error(`❌ User with email ${testEmail} not found in database!`);
      console.log('\nAvailable users in the database:');
      
      const users = await User.find({}, 'email role');
      if (users.length === 0) {
        console.log('No users found in the database!');
      } else {
        users.forEach(u => {
          console.log(`- ${u.email} (${u.role})`);
        });
      }
      
      process.exit(1);
    }
    
    console.log(`User found: ${user.name} (${user.role})`);
    
    // Verify password
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log(`✅ Password is correct!`);
      console.log('\nLogin credentials are valid. If you still cannot log in, the issue might be:');
      console.log('1. JWT_SECRET mismatch between server and client');
      console.log('2. Server configuration issue');
      console.log('3. Client-side authentication handling');
    } else {
      console.error(`❌ Password is incorrect!`);
    }
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (err) {
    console.error(`Error during verification: ${err.message}`);
    console.error(err);
  }
}

verifyLogin(); 
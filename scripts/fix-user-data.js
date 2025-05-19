const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function fixUserData() {
  try {
    // Get MongoDB URI
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

    console.log('Connecting to MongoDB Atlas...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');
    
    // Define User schema
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
    
    // Check users in database
    const users = await User.find({});
    
    console.log(`\nFound ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('No users found. Creating admin user...');
      
      // Create admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('\nExisting users:');
      for (const user of users) {
        console.log(`- ${user.email} (${user.role})`);
      }
      
      // Check if admin exists
      const adminUser = users.find(u => u.role === 'admin');
      if (!adminUser) {
        console.log('\nNo admin user found. Creating one...');
        
        const newAdmin = new User({
          name: 'Admin User',
          email: 'admin@example.com',
          password: await bcrypt.hash('password123', 10),
          role: 'admin'
        });
        
        await newAdmin.save();
        console.log('✅ Admin user created successfully');
      } else {
        console.log('\nResetting admin password...');
        
        adminUser.password = await bcrypt.hash('password123', 10);
        await adminUser.save();
        
        console.log('✅ Admin password reset successfully');
      }
    }
    
    console.log('\nChecking database indexes...');
    
    // Ensure proper email index
    try {
      await User.collection.dropIndex('email_1');
      console.log('Dropped existing email index');
    } catch (e) {
      console.log('No existing email index to drop or error:', e.message);
    }
    
    try {
      await User.collection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created new email index');
    } catch (e) {
      console.error('Error creating email index:', e.message);
    }
    
    console.log('\n✅ User data fix complete!');
    console.log('\nYou can now try logging in with:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');
    
    // Close connection
    await mongoose.connection.close();
    
  } catch (err) {
    console.error(`Error fixing user data: ${err.message}`);
    console.error(err);
  }
}

fixUserData(); 
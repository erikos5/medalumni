/**
 * MongoDB Data Migration Script
 * 
 * This script migrates data from your current MongoDB to MongoDB Atlas
 * by using the models directly, which is more reliable than raw MongoDB operations.
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load models
const User = require('../models/User');
const Profile = require('../models/Profile');
const School = require('../models/School');
const Event = require('../models/Event');
// Gallery model doesn't exist, so we exclude it

// Get the MongoDB connection strings
const getConnectionStrings = () => {
  try {
    // Get source connection string (current DB)
    let sourceUri;
    try {
      sourceUri = fs.readFileSync(path.join(__dirname, '..', 'mongodb-uri.txt'), 'utf8').trim();
    } catch (err) {
      sourceUri = 'mongodb://localhost:27017/mediterranean-alumni';
    }
    
    // Get target connection string (MongoDB Atlas)
    let targetUri = process.argv[2];
    if (!targetUri) {
      console.error('Please provide the MongoDB Atlas connection string as an argument:');
      console.error('node scripts/migrate-to-atlas.js "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"');
      process.exit(1);
    }
    
    console.log('Source URI:', sourceUri);
    console.log('Target URI:', targetUri);
    
    return { sourceUri, targetUri };
  } catch (err) {
    console.error('Error getting connection strings:', err);
    process.exit(1);
  }
};

// Migrate specific model data
const migrateModel = async (modelName, sourceModel, targetConnection) => {
  try {
    console.log(`\nMigrating ${modelName}...`);
    
    // Get data from source
    const data = await sourceModel.find({});
    console.log(`  - Found ${data.length} ${modelName} documents`);
    
    if (data.length === 0) {
      console.log(`  - No ${modelName} data to migrate`);
      return;
    }
    
    // Create target model
    const TargetModel = targetConnection.model(modelName, sourceModel.schema);
    
    // Clear target collection
    await TargetModel.deleteMany({});
    console.log(`  - Cleared target ${modelName} collection`);
    
    // Prepare data (convert to plain objects to avoid Mongoose validation issues)
    const plainData = data.map(doc => doc.toObject());
    
    // Insert data into target
    const result = await TargetModel.insertMany(plainData);
    console.log(`  - Inserted ${result.length} ${modelName} documents`);
    
    return result.length;
  } catch (err) {
    console.error(`Error migrating ${modelName}:`, err);
    return 0;
  }
};

// Main migration function
const migrateData = async () => {
  const { sourceUri, targetUri } = getConnectionStrings();
  
  // Connect to source database (current)
  const sourceConnection = await mongoose.createConnection(sourceUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log('Connected to source database.');
  
  // Connect to target database (MongoDB Atlas)
  const targetConnection = await mongoose.createConnection(targetUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log('Connected to target database (MongoDB Atlas).');
  
  try {
    // Migrate each model
    const userCount = await migrateModel('User', User, targetConnection);
    const profileCount = await migrateModel('Profile', Profile, targetConnection);
    const schoolCount = await migrateModel('School', School, targetConnection);
    const eventCount = await migrateModel('Event', Event, targetConnection);
    
    console.log('\nMigration Summary:');
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Profiles: ${profileCount}`);
    console.log(`  - Schools: ${schoolCount}`);
    console.log(`  - Events: ${eventCount}`);
    console.log('\nMigration completed successfully!');
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    // Close connections
    await sourceConnection.close();
    await targetConnection.close();
    console.log('Database connections closed.');
    process.exit(0);
  }
};

// Run the migration
migrateData(); 
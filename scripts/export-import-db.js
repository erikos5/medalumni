/**
 * MongoDB Data Migration Script
 * 
 * This script will:
 * 1. Connect to your existing MongoDB (local or previous remote)
 * 2. Fetch all collections and their data
 * 3. Connect to your new MongoDB Atlas instance
 * 4. Import all the data
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Get the MongoDB connection strings
const getConnectionStrings = async () => {
  try {
    // Get source connection string (current DB)
    let sourceUri = process.env.MONGO_URI;
    if (!sourceUri) {
      try {
        sourceUri = fs.readFileSync(path.join(__dirname, '..', 'mongodb-uri.txt'), 'utf8').trim();
      } catch (err) {
        sourceUri = 'mongodb://localhost:27017/mediterranean-alumni';
      }
    }
    
    // Get target connection string (MongoDB Atlas)
    let targetUri = process.argv[2];
    if (!targetUri) {
      console.error('Please provide the MongoDB Atlas connection string as an argument:');
      console.error('node scripts/export-import-db.js "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"');
      process.exit(1);
    }
    
    return { sourceUri, targetUri };
  } catch (err) {
    console.error('Error getting connection strings:', err);
    process.exit(1);
  }
};

// Connect to a MongoDB instance
const connectToMongo = async (uri, name) => {
  try {
    console.log(`Connecting to ${name} database...`);
    const conn = await mongoose.createConnection(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Connected to ${name} database.`);
    return conn;
  } catch (err) {
    console.error(`Error connecting to ${name} database:`, err);
    process.exit(1);
  }
};

// Get all collections from a database
const getCollections = async (connection) => {
  try {
    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Access the db object and list collections
    const db = connection.db;
    if (!db) {
      // Alternative approach if connection.db is not available
      const dbName = connection.name || connection.client.s.options.dbName;
      const collections = await connection.client.db(dbName).listCollections().toArray();
      return collections.map(c => c.name);
    }
    
    const collections = await db.listCollections().toArray();
    return collections.map(c => c.name);
  } catch (err) {
    console.error('Error getting collections:', err);
    console.error('Connection object:', Object.keys(connection));
    if (connection.client) {
      console.error('Client object:', Object.keys(connection.client));
    }
    process.exit(1);
  }
};

// Migrate data from source to target
const migrateData = async () => {
  const { sourceUri, targetUri } = await getConnectionStrings();
  
  // Connect to both databases
  const sourceConnection = await connectToMongo(sourceUri, 'source');
  const targetConnection = await connectToMongo(targetUri, 'target (MongoDB Atlas)');
  
  try {
    // Get all collections from source
    const collections = await getCollections(sourceConnection);
    console.log(`Found ${collections.length} collections: ${collections.join(', ')}`);
    
    // Process each collection
    for (const collectionName of collections) {
      console.log(`\nProcessing collection: ${collectionName}`);
      
      // Get data from source
      const sourceCollection = sourceConnection.collection(collectionName);
      const documents = await sourceCollection.find({}).toArray();
      console.log(`  - Found ${documents.length} documents`);
      
      // Drop existing collection in target if it exists
      try {
        await targetConnection.collection(collectionName).drop();
        console.log(`  - Dropped existing collection in target`);
      } catch (err) {
        // Collection might not exist, which is fine
      }
      
      // Insert data into target
      if (documents.length > 0) {
        const targetCollection = targetConnection.collection(collectionName);
        const result = await targetCollection.insertMany(documents);
        console.log(`  - Inserted ${result.insertedCount} documents`);
      }
    }
    
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
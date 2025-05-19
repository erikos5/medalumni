const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  try {
    // Try to read the MongoDB Atlas URI from the file
    const atlasUriPath = path.join(__dirname, '..', 'mongodb-atlas-uri.txt');
    let mongoURI;
    
    if (fs.existsSync(atlasUriPath)) {
      mongoURI = fs.readFileSync(atlasUriPath, 'utf8').trim();
      console.log('Using MongoDB Atlas URI from file');
    } else {
      console.log('MongoDB Atlas URI file not found, please check your configuration');
      process.exit(1);
    }

    console.log('Attempting to connect to MongoDB Atlas...');
    console.log(`Connection string: ${mongoURI.substring(0, 20)}...`);
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`Connected to: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    
    // List all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Close the connection
    await mongoose.connection.close();
    console.log('\nConnection closed successfully');
    
  } catch (err) {
    console.error(`❌ Error connecting to MongoDB Atlas: ${err.message}`);
    console.error('Error details:', err);
    process.exit(1);
  }
}

testConnection(); 
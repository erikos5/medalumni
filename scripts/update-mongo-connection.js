/**
 * MongoDB Connection Update Script
 * 
 * This script updates the MongoDB connection string in mongodb-uri.txt
 * to use the MongoDB Atlas connection.
 */

const fs = require('fs');
const path = require('path');

// Get the connection string from command line
const getConnectionString = () => {
  const uri = process.argv[2];
  if (!uri) {
    console.error('Please provide the MongoDB Atlas connection string as an argument:');
    console.error('node scripts/update-mongo-connection.js "mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority"');
    process.exit(1);
  }
  return uri;
};

// Update the connection string file
const updateConnectionString = (uri) => {
  try {
    console.log('Updating MongoDB connection string...');
    
    // Create backup of original file
    const filePath = path.join(__dirname, '..', 'mongodb-uri.txt');
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(__dirname, '..', 'mongodb-uri.txt.bak');
      fs.copyFileSync(filePath, backupPath);
      console.log(`  - Created backup of original file at ${backupPath}`);
    }
    
    // Write new connection string
    fs.writeFileSync(filePath, uri);
    console.log('  - Updated MongoDB connection string successfully');
    
    console.log('\nImportant: Make sure to .gitignore mongodb-uri.txt to keep your credentials secure!');
    console.log('You can now use this connection string for both local development and deployment.');
  } catch (err) {
    console.error('Error updating connection string:', err);
    process.exit(1);
  }
};

// Run the update
const connectionString = getConnectionString();
updateConnectionString(connectionString); 
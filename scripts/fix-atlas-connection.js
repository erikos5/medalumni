const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Try to load .env file if it exists
dotenv.config();

// Paths to key files
const dbConfigPath = path.join(__dirname, '..', 'config', 'db.js');
const atlasUriPath = path.join(__dirname, '..', 'mongodb-atlas-uri.txt');
const envPath = path.join(__dirname, '..', '.env');

async function fixAtlasConnection() {
  try {
    console.log('Starting fix for MongoDB Atlas connection...');
    
    // Check if Atlas URI file exists
    if (!fs.existsSync(atlasUriPath)) {
      console.error('Error: mongodb-atlas-uri.txt file not found!');
      return;
    }
    
    // Read the Atlas URI
    const atlasUri = fs.readFileSync(atlasUriPath, 'utf8').trim();
    console.log(`Found MongoDB Atlas URI: ${atlasUri.substring(0, 20)}...`);
    
    // Create or update .env file with the MongoDB Atlas URI
    const envContent = fs.existsSync(envPath) 
      ? fs.readFileSync(envPath, 'utf8') 
      : '';
      
    // Check if MONGO_URI is already in .env
    if (envContent.includes('MONGO_URI=')) {
      console.log('Updating existing MONGO_URI in .env file...');
      const updatedEnv = envContent.replace(
        /MONGO_URI=.*/,
        `MONGO_URI=${atlasUri}`
      );
      fs.writeFileSync(envPath, updatedEnv);
    } else {
      console.log('Adding MONGO_URI to .env file...');
      fs.writeFileSync(
        envPath, 
        `${envContent}\nMONGO_URI=${atlasUri}\nJWT_SECRET=securetoken123\n`
      );
    }
    
    console.log('✅ .env file updated successfully!');
    
    // Check if we need to update db.js file
    if (fs.existsSync(dbConfigPath)) {
      console.log('Checking db.js configuration...');
      const dbConfig = fs.readFileSync(dbConfigPath, 'utf8');
      
      // If db.js doesn't prioritize process.env.MONGO_URI, update it
      if (!dbConfig.includes('process.env.MONGO_URI ||')) {
        console.log('Updating db.js to prioritize environment variables...');
        const updatedDbConfig = dbConfig.replace(
          /const mongoURI = .*/,
          `const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediterranean-alumni';`
        );
        fs.writeFileSync(dbConfigPath, updatedDbConfig);
        console.log('✅ db.js updated successfully!');
      } else {
        console.log('db.js already configured correctly.');
      }
    }
    
    console.log('\nMongoDB Atlas connection fix complete! Try restarting your application.');
    console.log('If login still fails, check your JWT_SECRET environment variable and user credentials.');
    
  } catch (err) {
    console.error('Error fixing Atlas connection:', err);
  }
}

fixAtlasConnection(); 
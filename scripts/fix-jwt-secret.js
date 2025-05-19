const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function fixJwtSecret() {
  try {
    console.log('Fixing JWT secret for authentication...');
    
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Check if JWT_SECRET is already defined
    if (envContent.includes('JWT_SECRET=')) {
      console.log('JWT_SECRET already exists in .env. Updating it to a consistent value...');
      
      // Use a consistent JWT secret
      const updatedEnv = envContent.replace(
        /JWT_SECRET=.*/,
        'JWT_SECRET=mysecrettoken'
      );
      
      fs.writeFileSync(envPath, updatedEnv);
    } else {
      console.log('Adding JWT_SECRET to .env file...');
      
      // Append JWT_SECRET to existing content
      fs.writeFileSync(
        envPath,
        `${envContent}\nJWT_SECRET=mysecrettoken\n`
      );
    }
    
    console.log('✅ JWT_SECRET updated successfully in .env file!');
    console.log('\nImportant: Make sure your server is using the environment variables.');
    console.log('You may need to restart your server for changes to take effect.');
    console.log('\nTo restart your server:');
    console.log('1. Find and kill the existing server process:');
    console.log('   lsof -i :5006');
    console.log('   kill -9 <PID>');
    console.log('2. Start the server again:');
    console.log('   npm start');
    
  } catch (err) {
    console.error('Error fixing JWT secret:', err);
  }
}

fixJwtSecret(); 
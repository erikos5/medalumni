const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function checkClientServerConnection() {
  try {
    console.log('Checking client-server communication...');
    
    // First, check server connection
    console.log('\nStep 1: Testing server availability...');
    try {
      const serverRes = await axios.get('http://localhost:5006/api');
      console.log('✅ Server is reachable!');
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        console.error('❌ Server is not running! Please start the server:');
        console.log('   npm start');
        process.exit(1);
      } else {
        console.log('Server returned an error response:', err.message);
        console.log('This is okay - server is running but the /api endpoint might not exist');
      }
    }
    
    // Test login with admin credentials
    console.log('\nStep 2: Testing login with admin credentials...');
    try {
      const loginRes = await axios.post('http://localhost:5006/api/auth', {
        email: 'admin@example.com',
        password: 'password123'
      });
      
      if (loginRes.data && loginRes.data.token) {
        console.log('✅ Login successful! Token received');
        
        // Store token for future requests
        const token = loginRes.data.token;
        
        // Test authentication with token
        console.log('\nStep 3: Verifying authentication with token...');
        try {
          const authRes = await axios.get('http://localhost:5006/api/auth', {
            headers: {
              'x-auth-token': token
            }
          });
          
          if (authRes.data && authRes.data.role === 'admin') {
            console.log('✅ Authentication verified! User data retrieved');
            console.log(`   User: ${authRes.data.name} (${authRes.data.email})`);
            console.log(`   Role: ${authRes.data.role}`);
          } else {
            console.error('❌ Authentication issue: Response does not contain expected user data');
            console.log('Response:', authRes.data);
          }
        } catch (authErr) {
          console.error('❌ Authentication failed:', authErr.message);
          if (authErr.response) {
            console.log('Response data:', authErr.response.data);
          }
        }
      } else {
        console.error('❌ Login issue: Response does not contain token');
        console.log('Response:', loginRes.data);
      }
    } catch (loginErr) {
      console.error('❌ Login failed:', loginErr.message);
      if (loginErr.response) {
        console.log('Response data:', loginErr.response.data);
      }
    }
    
    // Test registration with a random user
    const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
    console.log(`\nStep 4: Testing registration with random user (${randomEmail})...`);
    
    try {
      const registerRes = await axios.post('http://localhost:5006/api/auth/register', {
        name: 'Test User',
        email: randomEmail,
        password: 'password123'
      });
      
      if (registerRes.data && registerRes.data.token) {
        console.log('✅ Registration successful! Token received');
      } else {
        console.error('❌ Registration issue: Response does not contain token');
        console.log('Response:', registerRes.data);
      }
    } catch (registerErr) {
      console.error('❌ Registration failed:', registerErr.message);
      if (registerErr.response) {
        console.log('Response data:', registerErr.response.data);
      }
    }
    
    console.log('\n=== Summary ===');
    console.log('If all steps passed with ✅, your client-server communication should be working.');
    console.log('If any steps failed with ❌, there may be issues with your API or authentication flow.');
    console.log('\nTry logging in through your client application with:');
    console.log('- Email: admin@example.com');
    console.log('- Password: password123');
    
  } catch (err) {
    console.error('Error checking client-server connection:', err.message);
  }
}

checkClientServerConnection(); 
const axios = require('axios');
const fs = require('fs');

async function resetAdmin() {
  try {
    console.log('Resetting admin authentication...');
    
    // Login to get a token
    const loginResponse = await axios.post('http://localhost:5006/api/auth', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const userData = loginResponse.data.user || {
      id: '5f8f8c8f8c8f8c8f8c8f8c9d',
      email: 'admin@example.com',
      role: 'admin'
    };
    
    console.log('Obtained token:', token.substring(0, 20) + '...');
    
    // Save the token and user data to files that can be used to reset the browser
    fs.writeFileSync('admin-token.txt', token);
    fs.writeFileSync('admin-user.json', JSON.stringify(userData, null, 2));
    
    console.log(`
=========== ADMIN RESET INSTRUCTIONS ===========
1. Open your browser to http://localhost:3001/
2. Open the developer console (F12 or right-click > Inspect > Console)
3. Run these commands in the console:

localStorage.setItem('token', '${token}');
localStorage.setItem('adminSession', 'true');
localStorage.setItem('user', '${JSON.stringify(userData).replace(/'/g, "\\'")}');

4. Refresh the page
5. You should now be logged in as admin and events will work
===============================================
`);
    
    // Test token by creating a test event
    console.log('\nTesting token by creating a test event...');
    try {
      const response = await axios.post(
        'http://localhost:5006/api/events', 
        {
          title: 'Admin Reset Test Event',
          description: 'This event was created to verify admin authentication is working',
          date: '2024-12-31',
          time: '12:00',
          location: 'Test Location',
          category: 'social'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      console.log('Test event created successfully!');
      console.log('Event ID:', response.data._id);
      console.log('Authentication is working properly');
    } catch (error) {
      console.error('Error creating test event:', error.message);
      if (error.response) {
        console.error('API Error:', error.response.data);
      }
    }
  } catch (error) {
    console.error('Failed to reset admin authentication:', error.message);
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
  }
}

resetAdmin(); 
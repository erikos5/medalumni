const axios = require('axios');

const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...');
    
    const loginResponse = await axios.post('http://localhost:5006/api/auth', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.data && loginResponse.data.token) {
      console.log('✓ SUCCESS: Received auth token');
      console.log('Token:', loginResponse.data.token.substring(0, 20) + '...');
      
      if (loginResponse.data.user) {
        console.log('✓ User data received:');
        console.log('  - ID:', loginResponse.data.user.id);
        console.log('  - Name:', loginResponse.data.user.name);
        console.log('  - Email:', loginResponse.data.user.email);
        console.log('  - Role:', loginResponse.data.user.role);
        
        if (loginResponse.data.user.role === 'admin') {
          console.log('✓ User has admin role');
        } else {
          console.log('✗ User does NOT have admin role');
        }
      } else {
        console.log('✗ No user data received in login response');
      }
      
      // Test authenticated endpoint with the token
      try {
        console.log('\nTesting authenticated endpoint with token...');
        const authResponse = await axios.get('http://localhost:5006/api/auth', {
          headers: {
            'x-auth-token': loginResponse.data.token
          }
        });
        
        console.log('Auth endpoint response status:', authResponse.status);
        console.log('Auth endpoint user data:', authResponse.data);
        console.log('✓ Successfully authenticated with token');
      } catch (authError) {
        console.error('✗ Error accessing authenticated endpoint:', authError.message);
        if (authError.response) {
          console.error('Response:', authError.response.status, authError.response.data);
        }
      }
      
    } else {
      console.error('✗ No token received in response');
      console.error('Response data:', loginResponse.data);
    }
  } catch (err) {
    console.error('✗ Login test failed:', err.message);
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response data:', err.response.data);
    }
  }
};

testAdminLogin(); 
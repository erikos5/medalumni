const axios = require('axios');

async function testDeleteEvent() {
  try {
    console.log('Testing event deletion flow');
    
    // 1. Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5006/api/auth', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('   Login successful. Token:', token.substring(0, 15) + '...');
    
    // 2. Create a test event
    console.log('2. Creating test event...');
    const createResponse = await axios.post(
      'http://localhost:5006/api/events',
      {
        title: 'Test Delete Event',
        description: 'This event will be deleted',
        date: '2024-12-30',
        time: '10:00',
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
    
    const eventId = createResponse.data._id;
    console.log('   Event created with ID:', eventId);
    
    // 3. Delete the event
    console.log('3. Deleting event...');
    const deleteResponse = await axios.delete(
      `http://localhost:5006/api/events/${eventId}`,
      {
        headers: {
          'x-auth-token': token
        }
      }
    );
    
    console.log('   Delete response:', deleteResponse.data);
    
    // 4. Verify the event is gone
    console.log('4. Verifying event is deleted...');
    try {
      await axios.get(`http://localhost:5006/api/events/${eventId}`);
      console.log('   ERROR: Event still exists!');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('   Success: Event was properly deleted (404 Not Found)');
      } else {
        console.error('   Error verifying deletion:', err.message);
      }
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (err) {
    console.error('Test failed:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Status:', err.response.status);
    }
  }
}

testDeleteEvent(); 
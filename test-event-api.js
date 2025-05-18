const axios = require('axios');
const fs = require('fs');

// First try to log in to get a token
async function testEventCreation() {
  try {
    console.log('Testing event API...');
    
    // Step 1: Login to get a token
    console.log('Step 1: Getting auth token by logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5006/api/auth', {
      email: 'admin@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful. Token obtained.');
    
    // Save token to file for reference
    fs.writeFileSync('admin-token.txt', token);
    console.log('Token saved to admin-token.txt');
    
    // Step 2: Create an event using the token
    console.log('\nStep 2: Creating a test event...');
    const eventData = {
      title: 'API Script Test Event',
      description: 'This event was created via the test script',
      date: '2024-12-25',
      time: '14:30',
      location: 'Test Script Location',
      category: 'social'
    };
    
    const eventResponse = await axios.post(
      'http://localhost:5006/api/events',
      eventData,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      }
    );
    
    console.log('Event created successfully!');
    console.log('New event details:');
    console.log('ID:', eventResponse.data._id);
    console.log('Title:', eventResponse.data.title);
    console.log('Date:', eventResponse.data.date);
    
    // Step 3: Verify the event was created by fetching all events
    console.log('\nStep 3: Verifying event creation by fetching all events...');
    const allEventsResponse = await axios.get('http://localhost:5006/api/events');
    
    const events = allEventsResponse.data;
    console.log(`Found ${events.length} events in total`);
    
    // Check if our event is in the list
    const ourEvent = events.find(event => event.title === eventData.title);
    if (ourEvent) {
      console.log('Success! Our event was found in the database.');
    } else {
      console.log('Warning: Our event was not found in the list of events.');
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error during test:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
  }
}

testEventCreation(); 
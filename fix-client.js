// This file contains code to diagnose and fix client-side issues
// Copy and paste sections into your browser console when needed

// 1. Check if admin session and token are set in localStorage
function checkAuth() {
  const token = localStorage.getItem('token');
  const adminSession = localStorage.getItem('adminSession');
  console.log('Token exists:', !!token);
  console.log('Token length:', token ? token.length : 0);
  if (token) console.log('Token starts with:', token.substr(0, 15) + '...');
  console.log('Admin session:', adminSession);
  
  // Check if user data is in localStorage
  const user = localStorage.getItem('user');
  console.log('User data exists:', !!user);
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('User role:', userData.role);
      console.log('User ID:', userData._id || userData.id);
    } catch (e) {
      console.log('Error parsing user data');
    }
  }
  
  return { token, adminSession };
}

// 2. Fix authentication issues
function fixAuth() {
  // Set proper admin session
  localStorage.setItem('adminSession', 'true');
  
  // Check if token exists, if not, alert user to login
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found! Please log in first.');
    return false;
  }
  
  // Set a proper user object if it doesn't exist
  let user;
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    user = {};
  }
  
  // Ensure user has admin role
  user.role = 'admin';
  user._id = user._id || user.id || '5f8f8c8f8c8f8c8f8c8f8c9d';
  user.id = user._id;
  user.name = user.name || 'Admin User';
  user.email = user.email || 'admin@example.com';
  
  localStorage.setItem('user', JSON.stringify(user));
  console.log('Auth fixed! User data updated with admin role.');
  return true;
}

// 3. Test event creation directly from the browser
async function testEventCreation() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found! Cannot create event.');
    return;
  }
  
  const eventData = {
    title: 'Browser Console Test Event',
    description: 'This event was created via the browser console',
    date: '2024-12-30',
    time: '15:30',
    location: 'Browser Console',
    category: 'social'
  };
  
  try {
    const response = await fetch('http://localhost:5006/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    
    if (data._id) {
      console.log('Success! Event created with ID:', data._id);
    } else {
      console.log('Error creating event:', data);
    }
  } catch (error) {
    console.error('Error creating event:', error);
  }
}

// 4. Disable the mock event feature in api.js interceptor
function disableMockEventFeature() {
  console.log('To fix the issue with your React app, you need to:');
  console.log('1. Open client/src/utils/api.js');
  console.log('2. Find lines 46-58 that create a mock event response');
  console.log('3. Comment out or remove those lines so real errors appear');
  console.log('4. This will help identify why the React app is failing to create events');
  console.log('5. Make sure you are properly logged in as admin before creating events');
}

console.log('Fix Client Helper loaded!');
console.log('To diagnose auth issues, run: checkAuth()');
console.log('To fix auth issues, run: fixAuth()');
console.log('To test event creation, run: testEventCreation()');
console.log('For instructions to disable mock events, run: disableMockEventFeature()'); 
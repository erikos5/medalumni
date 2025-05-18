// This script should be pasted into the browser console when logged in as admin
// It will output the token that can be copied for use in the test form

(function() {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Your authentication token is:');
    console.log(token);
    
    // Format for easy copying
    console.log('\nCopy the following token (without quotes):');
    console.log(`"${token}"`);
  } else {
    console.log('No token found in localStorage. Please log in first.');
  }
})(); 
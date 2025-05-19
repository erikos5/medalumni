const fs = require('fs');
const path = require('path');

async function fixClientConfig() {
  try {
    console.log('Fixing client configuration...');
    
    // Update client API utils
    const apiUtilsPath = path.join(__dirname, '..', 'client', 'src', 'utils', 'api.js');
    if (fs.existsSync(apiUtilsPath)) {
      console.log('\nUpdating API utils...');
      
      let apiUtils = fs.readFileSync(apiUtilsPath, 'utf8');
      
      // Make sure we're using http://localhost:5006
      if (!apiUtils.includes("'http://localhost:5006'")) {
        apiUtils = apiUtils.replace(
          /const API_URL = .*/,
          "const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5006';"
        );
        
        fs.writeFileSync(apiUtilsPath, apiUtils);
        console.log('✅ Updated API base URL');
      } else {
        console.log('API base URL already set correctly');
      }
    }
    
    // Update server CORS settings
    const serverPath = path.join(__dirname, '..', 'server.js');
    if (fs.existsSync(serverPath)) {
      console.log('\nUpdating server CORS settings...');
      
      let serverContent = fs.readFileSync(serverPath, 'utf8');
      
      // Make sure CORS is configured correctly
      if (serverContent.includes('app.use(cors({')) {
        // Update CORS configuration to accept all origins in development
        const updatedCors = `app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:3001', '*'],
  credentials: true
}));`;
        
        serverContent = serverContent.replace(
          /app\.use\(cors\(\{[\s\S]*?\}\)\);/m,
          updatedCors
        );
        
        fs.writeFileSync(serverPath, serverContent);
        console.log('✅ Updated server CORS settings');
      } else {
        console.log('CORS settings not found in server.js');
      }
    }
    
    // Create .env.local for client
    const clientEnvPath = path.join(__dirname, '..', 'client', '.env.local');
    console.log('\nCreating client environment variables...');
    
    fs.writeFileSync(
      clientEnvPath,
      'REACT_APP_API_URL=http://localhost:5006\n'
    );
    console.log('✅ Created client .env.local with API URL');
    
    // Fix setAuthToken utility
    const setAuthTokenPath = path.join(__dirname, '..', 'client', 'src', 'utils', 'setAuthToken.js');
    if (fs.existsSync(setAuthTokenPath)) {
      console.log('\nChecking setAuthToken utility...');
      
      const setAuthToken = fs.readFileSync(setAuthTokenPath, 'utf8');
      
      if (!setAuthToken.includes('console.log')) {
        // Add debug logging
        const updatedSetAuthToken = setAuthToken.replace(
          'const setAuthToken = token => {',
          'const setAuthToken = token => {\n  console.log(`Setting auth token: ${token ? token.substring(0, 10) + \'...\' : \'none\'}`);\n'
        );
        
        fs.writeFileSync(setAuthTokenPath, updatedSetAuthToken);
        console.log('✅ Updated setAuthToken with debug logging');
      } else {
        console.log('setAuthToken already has debug logging');
      }
    }
    
    // Make sure localStorage is synced between logins
    const authStatePath = path.join(__dirname, '..', 'client', 'src', 'context', 'auth', 'AuthState.js');
    if (fs.existsSync(authStatePath)) {
      console.log('\nChecking AuthState component...');
      
      let authState = fs.readFileSync(authStatePath, 'utf8');
      
      if (!authState.includes('localStorage.clear()')) {
        // Add localStorage.clear() to logout function
        authState = authState.replace(
          'const logout = () => {',
          'const logout = () => {\n    localStorage.clear();'
        );
        
        if (authState !== fs.readFileSync(authStatePath, 'utf8')) {
          fs.writeFileSync(authStatePath, authState);
          console.log('✅ Updated logout function to clear localStorage');
        } else {
          console.log('Logout function already properly implemented');
        }
      } else {
        console.log('Logout function already properly implemented');
      }
    }
    
    console.log('\n✅ Client configuration fix complete!');
    console.log('\nTo restart everything:');
    console.log('1. Restart the server:');
    console.log('   kill -9 $(lsof -t -i:5006)');
    console.log('   npm start &');
    console.log('2. Start the client:');
    console.log('   cd client && npm start');
    
  } catch (err) {
    console.error('Error fixing client configuration:', err.message);
    console.error(err);
  }
}

fixClientConfig();
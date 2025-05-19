import api from './api';

const setAuthToken = token => {
  console.log(`Setting auth token: ${token ? token.substring(0, 10) + '...' : 'none'}`);

  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken; 
const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('🔄 Testing login with demo credentials...\n');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'demo@trackmybuslk.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('User:', {
      id: response.data.user._id,
      username: response.data.user.username,
      email: response.data.user.email
    });
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testLogin();

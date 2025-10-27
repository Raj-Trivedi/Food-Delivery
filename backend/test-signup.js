import fetch from 'node-fetch';

const testSignup = async () => {
  try {
    console.log('Testing signup endpoint...');
    
    const response = await fetch('http://localhost:5000/api/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok && data.success) {
      console.log('✅ Signup test passed!');
    } else {
      console.log('❌ Signup test failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

testSignup(); 
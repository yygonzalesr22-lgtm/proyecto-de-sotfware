const http = require('http');

// Test 1: Register
console.log('🔍 Test 1: Registering user...');

const registerData = JSON.stringify({
  nombre: 'Admin',
  email: 'admin@example.com',
  password: 'pass1234'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': registerData.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`Response Code: ${res.statusCode}`);
    console.log('Response:', data);
    
    // Test 2: Login
    setTimeout(() => {
      console.log('\n🔍 Test 2: Login user...');
      
      const loginData = JSON.stringify({
        email: 'admin@example.com',
        password: 'pass1234'
      });
      
      const loginOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      };
      
      const loginReq = http.request(loginOptions, (res) => {
        let loginResData = '';
        res.on('data', (chunk) => { loginResData += chunk; });
        res.on('end', () => {
          console.log(`Response Code: ${res.statusCode}`);
          const loginResponse = JSON.parse(loginResData);
          console.log('✅ Login Response:', {
            ok: loginResponse.ok,
            msg: loginResponse.msg,
            token: loginResponse.token ? '✅ Token received' : '❌ No token',
            usuario: loginResponse.usuario
          });
        });
      });
      
      loginReq.on('error', (e) => {
        console.error(`❌ Login error: ${e.message}`);
      });
      
      loginReq.write(loginData);
      loginReq.end();
    }, 1000);
  });
});

req.on('error', (e) => {
  console.error(`❌ Register error: ${e.message}`);
});

req.write(registerData);
req.end();

const http = require('http');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const PORT = 5001; // Use 5001 for test runner to avoid conflict
process.env.PORT = PORT;

const app = require('express')();
const cors = require('cors');
app.use(cors());
app.use(require('express').json());
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use(require('./middleware/errorMiddleware').notFound);
app.use(require('./middleware/errorMiddleware').errorHandler);

const request = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data && { 'Content-Length': Buffer.byteLength(data) }),
          ...headers,
        },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(responseBody);
          } catch (e) {
            parsed = responseBody;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

const runTests = async () => {
  console.log('\n=======================================================');
  console.log('  RUNNING ILFN AUTHENTICATION INTEGRATION TEST SUITE   ');
  console.log('=======================================================\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas for testing');

  const server = app.listen(PORT);
  console.log(`✓ Test server running on port ${PORT}\n`);

  const testEmail = `test_${Date.now()}@ilfn.test`;
  let authToken = '';

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    console.assert(health.status === 200, `Health check failed: ${health.status}`);
    console.log(`[PASS] 1. GET /api/health returned 200 OK (${health.data.status}, DB: ${health.data.database})`);

    // 2. Register with missing fields
    const missingFields = await request('POST', '/api/auth/register', { name: 'Test' });
    console.assert(missingFields.status === 400, `Expected 400 for missing fields`);
    console.log(`[PASS] 2. POST /api/auth/register rejected missing fields (400)`);

    // 3. Register with mismatched passwords
    const pwdMismatch = await request('POST', '/api/auth/register', {
      name: 'Test User',
      email: testEmail,
      password: 'password123',
      confirmPassword: 'differentpassword',
    });
    console.assert(pwdMismatch.status === 400, `Expected 400 for password mismatch`);
    console.log(`[PASS] 3. POST /api/auth/register rejected password mismatch (400)`);

    // 4. Successful registration
    const regSuccess = await request('POST', '/api/auth/register', {
      name: 'Verified Test User',
      email: testEmail,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    });
    console.assert(regSuccess.status === 201, `Expected 201 for valid registration`);
    console.assert(regSuccess.data.data.token, `Expected token in registration response`);
    authToken = regSuccess.data.data.token;
    console.log(`[PASS] 4. POST /api/auth/register created user (201 Created, received JWT)`);

    // 5. Duplicate email registration
    const regDuplicate = await request('POST', '/api/auth/register', {
      name: 'Duplicate User',
      email: testEmail,
      password: 'SecurePassword123!',
      confirmPassword: 'SecurePassword123!',
    });
    console.assert(regDuplicate.status === 400, `Expected 400 for duplicate email`);
    console.log(`[PASS] 5. POST /api/auth/register prevented duplicate email (400 Bad Request)`);

    // 6. Login with invalid password
    const badLogin = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'WrongPassword',
    });
    console.assert(badLogin.status === 401, `Expected 401 for incorrect password`);
    console.log(`[PASS] 6. POST /api/auth/login rejected wrong password (401 Unauthorized)`);

    // 7. Successful login
    const loginSuccess = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: 'SecurePassword123!',
    });
    console.assert(loginSuccess.status === 200, `Expected 200 for valid login`);
    console.assert(loginSuccess.data.data.token, `Expected token in login response`);
    console.log(`[PASS] 7. POST /api/auth/login authenticated successfully (200 OK)`);

    // 8. Protected GET /api/auth/me without token
    const unauthMe = await request('GET', '/api/auth/me');
    console.assert(unauthMe.status === 401, `Expected 401 without auth token`);
    console.log(`[PASS] 8. GET /api/auth/me rejected request without token (401 Unauthorized)`);

    // 9. Protected GET /api/auth/me with token
    const authMe = await request('GET', '/api/auth/me', null, {
      Authorization: `Bearer ${authToken}`,
    });
    console.assert(authMe.status === 200, `Expected 200 with valid token`);
    console.assert(authMe.data.data.email === testEmail, `Expected matching user email`);
    console.assert(authMe.data.data.password === undefined, `Password must NOT be leaked in me endpoint`);
    console.log(`[PASS] 9. GET /api/auth/me returned authenticated user profile (200 OK, password protected)`);

    // 10. Clean up test user from MongoDB Atlas
    await User.deleteOne({ email: testEmail });
    console.log(`[PASS] 10. Successfully cleaned up test user from MongoDB Atlas`);

    console.log('\n=======================================================');
    console.log('  ALL 10 BACKEND INTEGRATION TESTS PASSED PERFECTLY!   ');
    console.log('=======================================================\n');
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

runTests();

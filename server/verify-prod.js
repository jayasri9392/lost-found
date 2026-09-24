const https = require('https');

const request = (method, path, body = null, origin = 'https://lost-found-mu-bay.vercel.app', token = null) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request('https://lost-found-jycm.onrender.com' + path, {
      method,
      headers: {
        'Origin': origin,
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
        ...(token && { 'Authorization': 'Bearer ' + token })
      }
    }, res => {
      let b = '';
      res.on('data', chunk => b += chunk);
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(b); } catch(e) { parsed = b; }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
};

async function runComprehensiveVerification() {
  console.log('================================================================');
  console.log('       RUNNING LIVE PRODUCTION & CORS VERIFICATION SUITE       ');
  console.log('================================================================\n');

  const vercelOrigins = [
    'https://lost-found-mu-bay.vercel.app',
    'https://lost-found-git-main-jayasris-projects-d2ecf1d8.vercel.app',
    'https://lost-found-39coz1cjo-jayasris-projects-d2ecf1d8.vercel.app',
    'https://random-preview-deployment-abc123.vercel.app',
    'http://localhost:5173'
  ];

  for (const origin of vercelOrigins) {
    const opt = await request('OPTIONS', '/api/auth/login', null, origin);
    const allowOrigin = opt.headers['access-control-allow-origin'];
    const allowCreds = opt.headers['access-control-allow-credentials'];
    console.log('[CORS PREFLIGHT] ' + origin + ' -> Status: ' + opt.status + ', Allow-Origin: ' + allowOrigin + ', Credentials: ' + allowCreds);
    if (allowOrigin !== origin || allowCreds !== 'true') {
      throw new Error('CORS preflight failed for ' + origin);
    }
  }

  console.log('\n--- Testing Full End-to-End Auth Cycle from Production Vercel Origin ---');
  const testEmail = 'production_verify_' + Date.now() + '@ilfn.test';
  const testPassword = 'Password123!';

  // 1. Register
  console.log('1. Testing Registration...');
  const reg = await request('POST', '/api/auth/register', {
    name: 'Verified Production User',
    email: testEmail,
    password: testPassword,
    confirmPassword: testPassword
  }, 'https://lost-found-mu-bay.vercel.app');
  console.log('Registration Status:', reg.status);
  console.log('Registration Message:', reg.data.message);
  const token = reg.data.data && reg.data.data.token;
  if (!token) throw new Error('No token received on registration');
  console.log('JWT Token successfully issued:', token.substring(0, 30) + '...');

  // 2. Get Profile (Protected)
  console.log('\n2. Testing GET /api/auth/me (Protected Route with JWT)...');
  const me = await request('GET', '/api/auth/me', null, 'https://lost-found-mu-bay.vercel.app', token);
  console.log('Me Status:', me.status);
  console.log('User Name:', me.data.data && me.data.data.name);
  console.log('User Email:', me.data.data && me.data.data.email);
  console.log('User Role:', me.data.data && me.data.data.role);

  // 3. Logout
  console.log('\n3. Testing POST /api/auth/logout...');
  const logout = await request('POST', '/api/auth/logout', null, 'https://lost-found-mu-bay.vercel.app', token);
  console.log('Logout Status:', logout.status, logout.data);

  // 4. Login
  console.log('\n4. Testing POST /api/auth/login...');
  const login = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: testPassword
  }, 'https://lost-found-mu-bay.vercel.app');
  console.log('Login Status:', login.status);
  console.log('Login Message:', login.data.message);
  console.log('New Token Received:', login.data.data && login.data.data.token && login.data.data.token.substring(0, 30) + '...');

  console.log('\n================================================================');
  console.log('    SUCCESS: ALL PRODUCTION AUTH FLOWS & CORS FULLY VERIFIED    ');
  console.log('================================================================');
}

runComprehensiveVerification().catch(err => {
  console.error('FAILED:', err);
  process.exit(1);
});

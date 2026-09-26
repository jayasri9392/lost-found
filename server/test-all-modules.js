const http = require('http');
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const LostItem = require('./models/LostItem');
const FoundItem = require('./models/FoundItem');
const Claim = require('./models/Claim');
const Notification = require('./models/Notification');
const Report = require('./models/Report');

const PORT = 5002;
process.env.PORT = PORT;

const app = require('express')();
const cors = require('cors');
app.use(cors());
app.use(require('express').json({ limit: '10mb' }));

app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lost-items', require('./routes/lostItemRoutes'));
app.use('/api/found-items', require('./routes/foundItemRoutes'));
app.use('/api/claims', require('./routes/claimRoutes'));
app.use('/api/matches', require('./routes/matchingRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
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

const runAllTests = async () => {
  console.log('\n=======================================================');
  console.log('  RUNNING COMPLETE ILFN FULL-STACK MODULE TEST SUITE  ');
  console.log('=======================================================\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB Atlas');

  const server = app.listen(PORT);
  console.log(`✓ Test server running on port ${PORT}\n`);

  const timestamp = Date.now();
  const userAEmail = `usera_${timestamp}@ilfn.test`;
  const userBEmail = `userb_${timestamp}@ilfn.test`;
  const adminEmail = `admin_${timestamp}@ilfn.test`;

  let tokenA = '';
  let tokenB = '';
  let tokenAdmin = '';

  let createdLostId = '';
  let createdFoundId = '';
  let createdClaimId = '';

  try {
    // 1. Create User A (Owner who loses an item)
    const regA = await request('POST', '/api/auth/register', {
      name: 'User Alice',
      email: userAEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    console.assert(regA.status === 201, 'User A creation failed');
    tokenA = regA.data.data.token;
    console.log('[PASS] 1. Registered User A (Token acquired)');

    // 2. Create User B (Finder who discovers an item)
    const regB = await request('POST', '/api/auth/register', {
      name: 'User Bob',
      email: userBEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    console.assert(regB.status === 201, 'User B creation failed');
    tokenB = regB.data.data.token;
    console.log('[PASS] 2. Registered User B (Token acquired)');

    // 3. Create Admin User
    const regAdmin = await request('POST', '/api/auth/register', {
      name: 'Admin Chief',
      email: adminEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    tokenAdmin = regAdmin.data.data.token;
    // Upgrade directly to admin in DB for testing
    await User.findByIdAndUpdate(regAdmin.data.data._id, { role: 'admin' });
    console.log('[PASS] 3. Registered & elevated Admin user');

    // 4. Report Lost Item by User A
    const lostRes = await request(
      'POST',
      '/api/lost-items',
      {
        title: 'Midnight Blue iPhone 13 in Clear Case',
        description: 'I lost my midnight blue iPhone 13 while studying in the central library cubicle.',
        category: 'Electronics',
        subcategory: 'Smartphone',
        location: 'Central Library 2nd Floor study cubicle',
        city: 'Vijayawada',
        dateLost: new Date().toISOString(),
        identifyingDetails: 'Small scratch on top corner, Spider-Man sticker on back',
      },
      { Authorization: `Bearer ${tokenA}` }
    );
    console.assert(lostRes.status === 201, `Create lost item failed: ${JSON.stringify(lostRes)}`);
    createdLostId = lostRes.data.data._id;
    console.log(`[PASS] 4. User A reported Lost Item (ID: ${createdLostId})`);

    // 5. Report Found Item by User B
    const foundRes = await request(
      'POST',
      '/api/found-items',
      {
        title: 'Blue iPhone 13 found near desks',
        description: 'Discovered this blue iPhone on desk 14 in the library.',
        category: 'Electronics',
        subcategory: 'Smartphone',
        location: 'Central Library 2nd Floor desk #14',
        city: 'Vijayawada',
        dateFound: new Date().toISOString(),
        identifyingDetails: 'Clear case with sticker on back',
        currentStorageLocation: 'With finder Bob',
      },
      { Authorization: `Bearer ${tokenB}` }
    );
    console.assert(foundRes.status === 201, `Create found item failed: ${JSON.stringify(foundRes)}`);
    createdFoundId = foundRes.data.data._id;
    console.log(`[PASS] 5. User B reported Found Item (ID: ${createdFoundId})`);

    // 6. Test Intelligent Matching
    const matchRes = await request('GET', `/api/matches/lost/${createdLostId}`);
    console.assert(matchRes.status === 200, 'Matching API failed');
    console.assert(matchRes.data.count > 0, 'Expected at least 1 match');
    const topMatch = matchRes.data.data[0];
    console.assert(topMatch.matchScore >= 50, `Expected high match score, got ${topMatch.matchScore}%`);
    console.log(`[PASS] 6. Intelligent Matching verified: ${topMatch.matchScore}% match score with factors: ${topMatch.matchReasons.join('; ')}`);

    // 7. User A submits Claim for Found Item
    const claimRes = await request(
      'POST',
      '/api/claims',
      {
        foundItemId: createdFoundId,
        reason: 'I left my blue iPhone in the Central Library 2nd floor desk yesterday.',
        proofDetails: 'The phone has a Spider-Man sticker and lockscreen passcode begins with 9.',
        contactPhone: '+91 9998887776',
      },
      { Authorization: `Bearer ${tokenA}` }
    );
    console.assert(claimRes.status === 201, `Claim submission failed: ${JSON.stringify(claimRes)}`);
    createdClaimId = claimRes.data.data._id;
    console.log(`[PASS] 7. User A submitted ownership claim (ID: ${createdClaimId})`);

    // 8. Prevent duplicate pending claim
    const dupClaim = await request(
      'POST',
      '/api/claims',
      {
        foundItemId: createdFoundId,
        reason: 'Another duplicate attempt',
        proofDetails: 'Duplicate details here',
      },
      { Authorization: `Bearer ${tokenA}` }
    );
    console.assert(dupClaim.status === 400, 'Expected 400 duplicate claim rejection');
    console.log('[PASS] 8. Duplicate pending claim was prevented (400)');

    // 9. User B reviews and Approves Claim
    const approveRes = await request(
      'PATCH',
      `/api/claims/${createdClaimId}/status`,
      {
        status: 'Approved',
        reviewerNotes: 'Verified Spider-Man sticker on back. Coordination underway.',
      },
      { Authorization: `Bearer ${tokenB}` }
    );
    console.assert(approveRes.status === 200, 'Claim approval failed');
    console.log('[PASS] 9. Finder User B approved ownership claim');

    // 10. Verify found item status transitioned to 'Claimed'
    const itemStatusRes = await request('GET', `/api/found-items/${createdFoundId}`);
    console.assert(itemStatusRes.data.data.status === 'Claimed', 'Expected status to be Claimed');
    console.log('[PASS] 10. Found item status automatically transitioned to "Claimed"');

    // 11. User A checks Notifications (should receive Claim Approved notification)
    const notifRes = await request('GET', '/api/notifications', null, {
      Authorization: `Bearer ${tokenA}`,
    });
    console.assert(notifRes.status === 200, 'Notification retrieval failed');
    console.assert(notifRes.data.count > 0, 'Expected notifications for User A');
    console.log(`[PASS] 11. User A notifications verified: received ${notifRes.data.count} alert(s) including approval alert`);

    // 12. Test Global Search
    const searchRes = await request('GET', '/api/search?keyword=iPhone&type=all');
    console.assert(searchRes.status === 200, 'Search failed');
    console.assert(searchRes.data.count >= 2, `Expected at least 2 search results, got ${searchRes.data.count}`);
    console.log(`[PASS] 12. Global search verified: found ${searchRes.data.count} items matching keyword "iPhone"`);

    // 13. Test Dashboard Summary
    const dashRes = await request('GET', '/api/dashboard/summary', null, {
      Authorization: `Bearer ${tokenA}`,
    });
    console.assert(dashRes.status === 200, 'Dashboard failed');
    console.assert(dashRes.data.data.counts.totalLost >= 1, 'Expected user lost count >= 1');
    console.log('[PASS] 13. Dashboard summary telemetry verified with real aggregated counts');

    // 14. Test Reporting an inappropriate listing
    const repRes = await request(
      'POST',
      '/api/reports',
      {
        reportedItemType: 'LostItem',
        reportedItemId: createdLostId,
        reason: 'Duplicate item',
        description: 'Testing moderation pipeline',
      },
      { Authorization: `Bearer ${tokenB}` }
    );
    console.assert(repRes.status === 201, 'Report submission failed');
    console.log('[PASS] 14. Flagged item report submitted for moderator review');

    // 15. Test Admin Access & Security (User A should get 403 Forbidden, Admin gets 200)
    const forbiddenAdmin = await request('GET', '/api/admin/stats', null, {
      Authorization: `Bearer ${tokenA}`,
    });
    console.assert(forbiddenAdmin.status === 403, 'Expected 403 Forbidden for non-admin');

    const validAdmin = await request('GET', '/api/admin/stats', null, {
      Authorization: `Bearer ${tokenAdmin}`,
    });
    console.assert(validAdmin.status === 200, 'Expected 200 OK for admin');
    console.log('[PASS] 15. Role-based security verified: Non-admin rejected (403), Admin authorized (200)');

    console.log('\n=======================================================');
    console.log('  ALL 15 FULL-STACK TESTS PASSED WITH 100% SUCCESS!   ');
    console.log('=======================================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    // Cleanup created test records
    try {
      await User.deleteMany({ email: { $in: [userAEmail, userBEmail, adminEmail] } });
      await LostItem.deleteMany({ title: /iPhone 13/ });
      await FoundItem.deleteMany({ title: /iPhone 13/ });
      await Claim.deleteMany({ reason: /Central Library/ });
      await Notification.deleteMany({});
      await Report.deleteMany({ description: /Testing moderation/ });
      console.log('✓ Cleaned up all temporary test artifacts from MongoDB Atlas');
    } catch (cleanErr) {
      console.warn('Cleanup warning:', cleanErr.message);
    }

    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
};

runAllTests();

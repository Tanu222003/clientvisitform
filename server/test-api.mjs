import http from 'http';

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch { json = data; }
        resolve({ statusCode: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend API Functional Test Suite...\n');
  const port = 5001;
  let testVisitId = null;
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('1. Testing GET /api/health');
    const health = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/health',
      method: 'GET'
    });
    assert(health.statusCode === 200, 'Health endpoint returns HTTP 200');
    assert(health.data.status === 'ok', 'Status is "ok"');
    assert(typeof health.data.totalVisits === 'number', 'Reports totalVisits count');

    // 2. Fetch all visits
    console.log('\n2. Testing GET /api/visits');
    const allVisits = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/visits',
      method: 'GET'
    });
    assert(allVisits.statusCode === 200, 'All visits endpoint returns HTTP 200');
    assert(Array.isArray(allVisits.data.data), 'Data is an array');
    assert(allVisits.data.data.length >= 18, `Seed data contains ${allVisits.data.data.length} records (>= 18)`);

    // 3. Search filter
    console.log('\n3. Testing GET /api/visits?q=Sneha');
    const searchRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/visits?q=Sneha',
      method: 'GET'
    });
    assert(searchRes.statusCode === 200, 'Search endpoint returns HTTP 200');
    assert(searchRes.data.data.some(v => v.name.includes('Sneha')), 'Correctly finds Sneha Reddy');

    // 4. Status filter
    console.log('\n4. Testing GET /api/visits?status=Booked');
    const statusRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/visits?status=Booked',
      method: 'GET'
    });
    assert(statusRes.statusCode === 200, 'Status filter returns HTTP 200');
    assert(statusRes.data.data.every(v => v.status === 'Booked'), 'All returned visits have status "Booked"');

    // 5. Validation: Missing fields
    console.log('\n5. Testing Validation on POST /api/visits');
    const missingRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/visits',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { name: 'Incomplete' });
    assert(missingRes.statusCode === 400, 'Rejects submission with missing phone/date (HTTP 400)');

    // 6. Validation: Invalid phone length
    const invalidPhoneRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/visits',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { name: 'Bad Phone', phone: '12345', date: '2026-10-05' });
    assert(invalidPhoneRes.statusCode === 400, 'Rejects phone numbers under 10 digits (HTTP 400)');

    // 7. Successful creation
    console.log('\n6. Testing POST /api/visits with valid payload');
    const createRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/visits',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      name: 'Dev Test Client',
      phone: '9820011223',
      date: '2026-10-05',
      property: '2BHK',
      budget: '75 Lakh',
      aspiration: 'Personal Use',
      remarks: 'Automated test suite verification note.'
    });
    assert(createRes.statusCode === 201, 'Successfully creates new visit (HTTP 201)');
    assert(createRes.data.data.name === 'Dev Test Client', 'Saved client name matches');
    assert(createRes.data.data.phone === '+91 98200 11223', 'Formatted 10-digit phone with +91 country prefix');
    assert(createRes.data.data.status === 'Visited', 'Defaulted status to "Visited"');
    testVisitId = createRes.data.data.id;

    // 8. Update visit (PATCH)
    console.log('\n7. Testing PATCH /api/visits/:id (Status and Remarks update)');
    const patchRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: `/api/visits/${testVisitId}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    }, {
      status: 'Booked',
      remarks: 'Client finalized booking token on unit 405.'
    });
    assert(patchRes.statusCode === 200, 'Update endpoint returns HTTP 200');
    assert(patchRes.data.data.status === 'Booked', 'Updated status to "Booked"');
    assert(patchRes.data.data.remarks.includes('unit 405'), 'Updated remarks paragraph');

    // 9. Stats Analytics
    console.log('\n8. Testing GET /api/stats');
    const statsRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/stats',
      method: 'GET'
    });
    assert(statsRes.statusCode === 200, 'Stats endpoint returns HTTP 200');
    assert(typeof statsRes.data.data.totalVisits === 'number', 'Computes total visits');
    assert(typeof statsRes.data.data.personalPercent === 'number', 'Computes personal use %');
    assert(Array.isArray(statsRes.data.data.propertyBreakdown), 'Provides property breakdown array');

    // 10. CSV Export
    console.log('\n9. Testing GET /api/export');
    const exportRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: '/api/export',
      method: 'GET'
    });
    assert(exportRes.statusCode === 200, 'Export endpoint returns HTTP 200');
    assert(exportRes.headers['content-type'].includes('text/csv'), 'Content-Type is text/csv');
    assert(typeof exportRes.data === 'string' && exportRes.data.includes('Client Name,Date,Phone'), 'CSV contains correct header row');
    assert(exportRes.data.includes('Dev Test Client'), 'Export includes latest visit records');

    // 11. Cleanup (DELETE)
    console.log('\n10. Testing DELETE /api/visits/:id');
    const deleteRes = await makeRequest({
      hostname: 'localhost',
      port,
      path: `/api/visits/${testVisitId}`,
      method: 'DELETE'
    });
    assert(deleteRes.statusCode === 200, 'Cleaned up test visit with HTTP 200');

    console.log(`\n===========================================`);
    console.log(`🎉 Backend Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`===========================================`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err.message);
    process.exit(1);
  }
}

runTests();

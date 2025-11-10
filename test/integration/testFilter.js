/**
 * Demo: QUnit.config.testFilter
 *
 * The testFilter callback allows you to programmatically filter which tests run
 * at runtime. This is useful for CI workflows, flaky test quarantine, dynamic
 * test selection, and other advanced scenarios.
 */

// ============================================================================
// Example: Combined testFilter implementation
// ============================================================================

const quarantineList = ['flaky network test', 'timing-dependent test'];

QUnit.config.testFilter = function (testInfo) {
  // testInfo contains: { testId, testName, module, skip }

  // 1. Skip quarantined tests in CI
  if (process.env.CI === 'true') {
    const isQuarantined = quarantineList.some(function (pattern) {
      return testInfo.testName.indexOf(pattern) !== -1;
    });
    if (isQuarantined) {
      console.log('[QUARANTINE] Skipping: ' + testInfo.module + ' > ' + testInfo.testName);
      return false;
    }
  }

  // 2. Skip slow tests in quick mode
  if (process.env.QUICK_RUN === 'true') {
    if (testInfo.testName.toLowerCase().indexOf('slow') !== -1) {
      console.log('[QUICK_RUN] Skipping slow test: ' + testInfo.testName);
      return false;
    }
  }

  // 3. Filter by module name if specified
  if (process.env.TEST_MODULE) {
    if (testInfo.module.indexOf(process.env.TEST_MODULE) === -1) {
      return false;
    }
  }

  // 4. Parallel sharding - distribute tests across workers
  if (process.env.WORKER_ID !== undefined) {
    const WORKER_ID = parseInt(process.env.WORKER_ID, 10);
    const TOTAL_WORKERS = parseInt(process.env.TOTAL_WORKERS || '1', 10);

    let hash = 0;
    for (let i = 0; i < testInfo.testId.length; i++) {
      const char = testInfo.testId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    hash = Math.abs(hash);

    const assignedWorker = hash % TOTAL_WORKERS;
    if (assignedWorker !== WORKER_ID) {
      return false;
    }
    console.log('  [Worker ' + WORKER_ID + '] Running: ' + testInfo.module + ' > ' + testInfo.testName);
  }

  // 5. Feature detection - skip tests for unavailable features
  // Tests tagged with [feature] in name are checked against runtime capabilities
  const features = {
    webgl: typeof WebGLRenderingContext !== 'undefined',
    webrtc: typeof RTCPeerConnection !== 'undefined',
    serviceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
    indexedDB: typeof indexedDB !== 'undefined'
  };

  for (const feature in features) {
    const tag = '[' + feature + ']';
    if (testInfo.testName.indexOf(tag) !== -1 && !features[feature]) {
      console.log('[FEATURE] Skipping ' + feature + ' test: ' + testInfo.testName);
      return false;
    }
  }

  return true;
};

// ============================================================================
// Example 2: Quarantine flaky tests in CI
// ============================================================================

if (process.env.CI === 'true') {
  const quarantineList = [
    'flaky network test',
    'timing-dependent test',
    'unreliable integration test'
  ];

  QUnit.config.testFilter = function (testInfo) {
    const isQuarantined = quarantineList.some(pattern =>
      testInfo.testName.includes(pattern)
    );

    if (isQuarantined) {
      console.log(`[QUARANTINE] Skipping: ${testInfo.module} > ${testInfo.testName}`);
      return false;
    }

    return true;
  };
}

// ============================================================================
// Example 3: Filter by module name
// ============================================================================

if (process.env.TEST_MODULE) {
  const targetModule = process.env.TEST_MODULE;

  QUnit.config.testFilter = function (testInfo) {
    const moduleMatches = testInfo.module.includes(targetModule);

    if (!moduleMatches) {
      console.log(`[MODULE_FILTER] Skipping: ${testInfo.module}`);
    }

    return moduleMatches;
  };
}

// ============================================================================
// Example 4: Feature flags - Run tests based on runtime capabilities
// ============================================================================

const features = {
  webgl: typeof WebGLRenderingContext !== 'undefined',
  webrtc: typeof RTCPeerConnection !== 'undefined',
  serviceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
  indexedDB: typeof indexedDB !== 'undefined'
};

QUnit.config.testFilter = function (testInfo) {
  for (const [feature, available] of Object.entries(features)) {
    if (testInfo.testName.includes(`[${feature}]`) && !available) {
      console.log(`[FEATURE_FLAG] Skipping ${feature} test: ${testInfo.testName}`);
      return false;
    }
  }

  return true;
};

// ============================================================================
// Example 5: Parallel test sharding across workers
// ============================================================================

if (process.env.WORKER_ID !== undefined) {
  const WORKER_ID = parseInt(process.env.WORKER_ID, 10);
  const TOTAL_WORKERS = parseInt(process.env.TOTAL_WORKERS || '1', 10);

  console.log(`Worker ${WORKER_ID + 1} of ${TOTAL_WORKERS}`);

  function hashTestId (testId) {
    let hash = 0;
    for (let i = 0; i < testId.length; i++) {
      const char = testId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  QUnit.config.testFilter = function (testInfo) {
    const hash = hashTestId(testInfo.testId);
    const assignedWorker = hash % TOTAL_WORKERS;
    const shouldRun = assignedWorker === WORKER_ID;

    if (shouldRun) {
      console.log(`  [Worker ${WORKER_ID}] Running: ${testInfo.module} > ${testInfo.testName}`);
    }

    return shouldRun;
  };
}

// ============================================================================
// Example 6: Combine multiple filter conditions
// ============================================================================

QUnit.config.testFilter = function (testInfo) {
  const quarantined = ['flaky test'];
  if (quarantined.some(pattern => testInfo.testName.includes(pattern))) {
    return false;
  }

  if (process.env.QUICK_RUN && testInfo.testName.includes('slow')) {
    return false;
  }

  if (process.env.TEST_MODULE && !testInfo.module.includes(process.env.TEST_MODULE)) {
    return false;
  }

  return true;
};

// ============================================================================
// Example tests
// ============================================================================

QUnit.module('Fast tests', function () {
  QUnit.test('quick calculation', function (assert) {
    assert.equal(2 + 2, 4);
  });

  QUnit.test('string operation', function (assert) {
    assert.equal('test'.toUpperCase(), 'TEST');
  });
});

QUnit.module('Slow tests', function () {
  QUnit.test('slow database query', function (assert) {
    assert.ok(true);
  });

  QUnit.test('slow network request', function (assert) {
    assert.ok(true);
  });
});

QUnit.module('Integration tests', function () {
  QUnit.test('API integration', function (assert) {
    assert.ok(true);
  });

  QUnit.test('flaky network test', function (assert) {
    assert.ok(true);
  });

  QUnit.test('timing-dependent test', function (assert) {
    assert.ok(true);
  });
});

QUnit.module('Feature-specific tests', function () {
  QUnit.test('[webgl] 3D rendering', function (assert) {
    assert.ok(true, 'WebGL test');
  });

  QUnit.test('[webrtc] peer connection', function (assert) {
    assert.ok(true, 'WebRTC test');
  });

  QUnit.test('[serviceWorker] caching', function (assert) {
    assert.ok(true, 'Service Worker test');
  });

  QUnit.test('[indexedDB] storage', function (assert) {
    assert.ok(true, 'IndexedDB test');
  });
});

// ============================================================================
// Usage Examples:
// ============================================================================
//
// Skip slow tests:
//   QUICK_RUN=true node bin/qunit.js demos/testFilter.js
//
// Run only "Fast tests" module:
//   TEST_MODULE="Fast tests" node bin/qunit.js demos/testFilter.js
//
// Enable quarantine in CI:
//   CI=true node bin/qunit.js demos/testFilter.js
//
// Parallel execution with 3 workers:
//   WORKER_ID=0 TOTAL_WORKERS=3 node bin/qunit.js demos/testFilter.js
//   WORKER_ID=1 TOTAL_WORKERS=3 node bin/qunit.js demos/testFilter.js
//   WORKER_ID=2 TOTAL_WORKERS=3 node bin/qunit.js demos/testFilter.js
//
// ============================================================================
// Notes:
// ============================================================================
//
// - testFilter runs AFTER test.only/test.skip/test.if checks
// - testFilter runs BEFORE CLI --filter and --module parameters
// - Return true to run the test, false to skip it
// - Thrown errors are logged but don't stop the test run
// - testInfo.skip is true if test was already marked to skip
//

import QUnit from '../core';
import { window, document } from '../globals';

(function () {
  if (!window || !document) {
    return;
  }

  const config = QUnit.config;
  const hasOwn = Object.prototype.hasOwnProperty;

  // Stores fixture HTML for resetting later
  function storeFixture () {
    // Avoid overwriting user-defined values
    // TODO: Change to negative null/undefined check once declared in /src/config.js
    if (hasOwn.call(config, 'fixture')) {
      return;
    }

    const fixture = document.getElementById('qunit-fixture');
    if (fixture) {
      config.fixture = fixture.cloneNode(true);
    }
  }

  QUnit.begin(storeFixture);

  // Resets the fixture DOM element if available.
  function resetFixture () {
    if (config.fixture == null) {
      return;
    }

    const fixture = document.getElementById('qunit-fixture');
    const resetFixtureType = typeof config.fixture;
    if (resetFixtureType === 'string') {
      // support user defined values for `config.fixture`
      const newFixture = document.createElement('div');
      newFixture.setAttribute('id', 'qunit-fixture');
      newFixture.innerHTML = config.fixture;
      fixture.parentNode.replaceChild(newFixture, fixture);
    } else {
      const clonedFixture = config.fixture.cloneNode(true);
      fixture.parentNode.replaceChild(clonedFixture, fixture);
    }
  }

  QUnit.testStart(resetFixture);
})();

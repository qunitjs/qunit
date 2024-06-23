export default function initFixture (QUnit, document) {
  const config = QUnit.config;

  // Stores fixture HTML for resetting later
  function storeFixture () {
    // Avoid overwriting user-defined values
    if (config.fixture !== undefined) {
      // If set to null, do nothing as the fixture feature is disabled.
      //
      // If set to string or HTMLElement, also do nothing because in that case
      // we will restore the fixture to the configured value after each test,
      // instead of using the initial DOM value of #qunit-fixture as the
      // configured value to restore (default behaviour).
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
    if (config.fixture === undefined || config.fixture === null) {
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
}

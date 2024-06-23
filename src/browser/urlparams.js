const hasOwn = Object.prototype.hasOwnProperty;

export default function initUrlConfig (QUnit) {
  // Wait until QUnit.begin() so that users can add their keys to urlConfig
  // any time during test loading, including during `QUnit.on('runStart')`.
  QUnit.begin(function () {
    const urlConfig = QUnit.config.urlConfig;

    for (let i = 0; i < urlConfig.length; i++) {
      // Options can be either strings or objects with nonempty "id" properties
      let option = QUnit.config.urlConfig[i];
      if (typeof option !== 'string') {
        option = option.id;
      }

      // only create new property for user-defined QUnit.config.urlConfig keys
      // that don't conflict with a built-in QUnit.config option or are otherwise
      // already set. This prevents internal TypeError from bad urls where keys
      // could otherwise unexpectedly be set to type string or array.
      //
      // Given that HTML Reporter renders checkboxes based on QUnit.config
      // instead of QUnit.urlParams, this also helps make sure that checkboxes
      // for built-in keys are correctly shown as off if a urlParams value exists
      // but was invalid and discarded by config.js.
      if (!hasOwn.call(QUnit.config, option)) {
        QUnit.config[option] = QUnit.urlParams[option];
      }
    }
  });
}

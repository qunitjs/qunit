const workerRun = function({handleInitData, globalPort = globalThis}) {
  const loggingKeys = ['begin', 'done', 'moduleDone', 'moduleStart', 'testDone', 'testStart', 'log'];
  const jsReporterKeys = ['testStart', 'testEnd', 'suiteStart', 'suiteEnd', 'runStart', 'runEnd'];

  globalThis.QUnit = globalThis.QUnit || {};
  globalThis.QUnit.config = globalThis.QUnit.config || {};
  globalThis.QUnit.config.autostart = false;
  globalThis.QUnit.config.isWorker = true;

  let port;
  const initQUnit = function() {
    loggingKeys.forEach(function(key) {
      QUnit[key](function(details) {
        port.postMessage({type: 'qunit-event', key, details, moduleIds: QUnit.config.moduleId});
      });
    });

    jsReporterKeys.forEach(function(key) {
      QUnit.on(key, function(details) {
        const message = {
          type: 'js-reporter',
          key,
          details,
          moduleIds: QUnit.config.moduleId
        };

        // QUnit also uses stats for reporting
        if (key === 'runEnd') {
          message.stats = QUnit.config.stats;
        }
        port.postMessage(message);
      });
    });
  };

  const handleMessage = function(e) {
    const message = e.data;

    if (message.type === 'testId') {
      QUnit.config.testId = QUnit.config.testId || [];
      return QUnit.config.testId.push(e.data.testId);
    }

    if (message.type === 'get-info') {
      if (message.filter) {
        Object.keys(message.filter).forEach(function(key) {
          QUnit.config[key] = message.filter[key];
        });
      }
      const testIds = QUnit.config.queue.reduce((acc, v) => {
        if (v && v.test && v.test.valid()) {
          acc.push(v.test.testId);
        }
        return acc;
      }, []);

      return port.postMessage({type: 'info', testIds, modules: QUnit.config.modules});
    }

    if (message.type === 'start') {
      return QUnit.start()
    }
  };

  const handleInitialMessage = function(e) {
    globalPort.removeEventListener('message', handleInitialMessage);

    port = e && e.data && e.data.port || e.port;
    port.addEventListener('message', handleMessage);
    port.start()
    handleInitData(e.data || e).then(function() {
      initQUnit();
      port.postMessage('init');
    });
  };
  globalPort.addEventListener('message', handleInitialMessage);
};

export default workerRun;

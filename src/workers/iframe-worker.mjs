import BaseWorker from './base-worker.mjs';

const sandboxPermissions = [
  'allow-downloads',
  'allow-forms',
  'allow-modals',
  'allow-orientation-lock',
  'allow-pointer-lock',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-presentation',
  'allow-scripts',
  'allow-top-navigation'
];

class IframeWorker extends BaseWorker {
  constructor(files) {
    super();
    this.fixture_ = document.getElementById('qunit-iframe-worker-fixture');

    if (!this.fixture_) {
      this.fixture_ = document.createElement('div');

      this.fixture_.id = 'qunit-iframe-worker-fixture';
      this.fixture_.style.display = 'none';

      document.body.appendChild(this.fixture_);
    }

    this.readyPromise_ = new Promise((resolve, reject) => {
      this.iframe_ = document.createElement('iframe');
      this.iframe_.setAttribute('loading', 'eager');
      this.iframe_.setAttribute('sandbox', sandboxPermissions.join(' '));
      this.iframe_.src = window.location.origin
        .replace(window.location.port, window.location.port === '8080' ? '8081' : '8080') + '/node_modules/qunit/src/workers/iframe-run.html';

      this.loadListener_ = (e) => {
        this.iframe_.removeEventListener('load', this.loadListener_, false);
        this.loadListener_ = null;
        resolve();
      };

      this.iframe_.addEventListener('load', this.loadListener_, false);
      this.fixture_.appendChild(this.iframe_);
    }).then(() => new Promise((resolve, reject) => {
      const {port1, port2} = new MessageChannel();

      this.port_ = port1;
      this.initMessage_ = (e) => {
        this.port_.removeEventListener('message', this.initMessage_);
        this.initMessage_ = null;
        this.busy_ = false;
        resolve();
      };
      this.port_.addEventListener('message', this.initMessage_);
      this.port_.start();

      this.iframe_.contentWindow.postMessage({port: port2, imports: files}, '*', [port2]);
    }));
  }

  dispose() {
    if (this.initMessage_) {
      this.port_.removeEventListener('message', this.initMessage_);
      this.initMessage_ = null;
    }

    super.dispose();

    if (this.loadListener_) {
      this.iframe_.removeEventListener('load', this.loadListener_, false);
    }

    this.iframe_.remove();
    this.iframe_ = null;


    if (!this.fixture_.firstChild) {
      this.fixture_.remove();
    }
    this.fixture_ = null;
  }
}

export default IframeWorker;

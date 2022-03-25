import BaseWorker from './base-worker.mjs';

class WebWorker extends BaseWorker {
  constructor(files) {
    super();
    this.readyPromise_ = new Promise((resolve, reject) => {
      this.worker_ = new Worker('/node_modules/qunit/src/workers/web-worker-run.mjs', {name: 'qunit-web-worker', type: 'module'});

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
      this.worker_.postMessage({port: port2, imports: files}, [port2]);
    });
  }

  dispose() {
    if (this.initMessage_) {
      this.port_.removeEventListener('message', this.initMessage_);
      this.initMessage_ = null;
    }
    this.worker_.terminate();
    URL.revokeObjectURL(this.objectUrl_);
    this.objectUrl_ = null;
    this.worker_ = null;

  }
}

export default WebWorker;

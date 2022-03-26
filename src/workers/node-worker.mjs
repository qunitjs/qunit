import { Worker, MessageChannel } from 'worker_threads';
import BaseWorker from './base-worker.mjs';
import path from 'node:path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class NodeWorker extends BaseWorker {
  constructor(files) {
    super();

    this.readyPromise_ = new Promise((resolve, reject) => {
      this.worker_ = new Worker(path.join(__dirname, 'node-worker-run.mjs'));
      const {port1, port2} = new MessageChannel();

      this.port_ = port1;
      this.initMessage_ = (e) => {
        this.port_.off('message', this.initMessage_);
        this.initMessage_ = null;
        this.busy_ = false;
        resolve();
      };
      this.port_.on('message', this.initMessage_);
      this.worker_.postMessage({port: port2, imports: files}, [port2]);
    });
  }

  dispose() {
    if (this.initMessage_) {
      this.port_.off('message', this.initMessage_);
      this.initMessage_ = null;

    }
    this.worker_.terminate();
    this.worker_ = null;
  }
}

export default NodeWorker;

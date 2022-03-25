class BaseWorker {
  constructor() {
    this.listeners_ = [];
    this.busy_ = true;
  }

  waitReady() {
    return this.readyPromise_;
  }

  busy() {
    return this.busy_;
  }

  send(data) {
    this.port_.postMessage(data);
  }

  listen(fn) {
    this.listeners_.push(fn);
    this.port_.addEventListener('message', fn);
  }

  unlisten(fn) {
    const i = this.listeners_.indexOf(fn);

    if (i !== -1) {
      this.listeners_.splice(i, 1);
    }
    this.port_.removeEventListener('message', fn);
  }

  task(data) {
    this.busy_ = true;

    return new Promise((resolve, reject) => {
      this.handleMessage_ = (e) => {
        this.port_.removeEventListener('message', this.handleMessage_);
        this.handleMessage_ = null;
        this.busy_ = false;
        resolve(e.data);
      };

      this.port_.addEventListener('message', this.handleMessage_);
      this.port_.postMessage(data);
    });
  }


  dispose() {
    if (this.handleMessage_) {
      this.port_.removeEventListener('message', this.handleMessage_);
    }
    this.port_.close();
    this.port_ = null;
  }
}

export default BaseWorker;

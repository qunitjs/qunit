class WorkerFactory {
  static workerClasses = [];
  static registerWorkerClass(WorkerClass) {
    WorkerFactory.workerClasses.push(WorkerClass);
  }

  constructor(options) {
    options = Object.assign({
      maxThreads: 4,
      files: [],
    }, options || {});

    this.workers = [];
    this.files = options.files;
    this.maxThreads = options.maxThreads;

    const WorkerClass = WorkerFactory.workerClasses.find((c) => c.name === options.className);

    if (!WorkerClass) {
      throw Error('Must provide a valid workerType option to WorkerFactory');
    }

    this.WorkerClass = WorkerClass;
  }

  createWorker() {
    if (this.workers.length > this.maxThreads) {
      throw new Error('Maximum number of workers already created');
    }
    const worker = new this.WorkerClass(this.files);

    this.workers.push(worker);

    return worker.waitReady().then(() => Promise.resolve(worker));
  };

  createWorkers(count) {
    const promises = [];

    for (let i = 0; i < count; i++) {
      promises.push(this.createWorker());
    }

    return Promise.all(promises)
  }

  dispose() {
    this.workers.forEach(function(worker) {
      worker.dispose();
    });

    this.workers.length = 0;
  }
}
export default WorkerFactory;

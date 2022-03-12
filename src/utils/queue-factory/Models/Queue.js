import promiseReflect from 'promise-reflect';
import uuid from 'uuid';
import Worker from './Worker';

const STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export class Queue {
  constructor() {
    this.worker = new Worker();
    this.status = STATUSES.INACTIVE;
    this.collection = [];
    this.failedCollection = [];
  }

  addWorker(jobName, worker, options = {}) {
    this.worker.addWorker(jobName, worker, options);
  }

  removeWorker(jobName) {
    this.worker.removeWorker(jobName);
  }

  createJob(name, payload = {}, options = {}, startQueue = true) {
    if (!name) {
      throw new Error('Job name must be supplied.');
    }

    // Validate options
    if (options.timeout < 0 || options.attempts < 0) {
      throw new Error('Invalid job option.');
    }

    const jobData = {
      id: uuid.v4(),
      name,
      payload: JSON.stringify(payload),
      data: JSON.stringify({
        attempts: options.attempts || 1
      }),
      priority: options.priority || 0,
      active: false,
      timeout: (options.timeout >= 0) ? options.timeout : 25000,
      created: new Date(),
      failed: null
    }
    this.collection.push(jobData);

    // Start queue on job creation if it isn't running by default.
    if (startQueue && this.status == STATUSES.INACTIVE) {
      this.start();
    }


  }

  async start() {  // Start processing the queue.

    // If queue is already running, don't fire up concurrent loop.
    if (this.status == STATUSES.ACTIVE) {
      return false;
    }

    this.status = STATUSES.ACTIVE;

    // Get jobs to process
    while (this.status == STATUSES.ACTIVE && this.collection.length) {

      // Loop over jobs and process them concurrently.
      const processingJobs = this.collection.map( job => {
        return this.processJob(job);
      });

      // Promise Reflect ensures all processingJobs resolve so
      // we don't break await early if one of the jobs fails.
      await Promise.all(processingJobs.map(promiseReflect));
    }

    this.stop();

  }

  stop() { //Stop processing queue.
    this.status = STATUSES.INACTIVE;
  }

  async getJobs() {
    return this.collection;
  }

  async getFailedJobs() {
    return this.failedCollection;
  }

  async processJob(job) {
    const jobName = job.name;
    const jobId = job.id;
    const jobPayload = JSON.parse(job.payload);

    // Fire onStart job lifecycle callback
    this.worker.executeJobLifecycleCallback('onStart', jobName, jobId, jobPayload);

    try {

      await this.worker.executeJob(job);

      // Remove job from the queue
      this.collection = this.collection.filter(job => job.id  !== jobId);

      // Job has processed successfully, fire onSuccess and onComplete job lifecycle callbacks.
      this.worker.executeJobLifecycleCallback('onSuccess', jobName, jobId, jobPayload);
      this.worker.executeJobLifecycleCallback('onComplete', jobName, jobId, jobPayload);

    } catch (error) {
      // Handle job failure logic, including retries.
      let jobData = JSON.parse(job.data);
      this.failedCollection.push(job);
      this.collection = this.collection.filter(job => job.id !== jobId);

      // Execute job onFailure lifecycle callback.
      this.worker.executeJobLifecycleCallback('onFailure', jobName, jobId, jobPayload);

      // If job has failed all attempts execute job onFailed and onComplete lifecycle callbacks.
      if (jobData.failedAttempts >= jobData.attempts) {
        this.worker.executeJobLifecycleCallback('onFailed', jobName, jobId, jobPayload);
        this.worker.executeJobLifecycleCallback('onComplete', jobName, jobId, jobPayload);
      }
    }
  }

  flushQueue(jobName = null) {
    if (jobName) {
      this.collection = this.collection.filter(job => job.name  === jobName);
    } else {
      this.collection = [];
    }
  }
}

export async function queueFactory() {
  const queue = new Queue();
  return queue;

}

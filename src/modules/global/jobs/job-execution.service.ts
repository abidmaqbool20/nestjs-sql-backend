import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationJob } from './classes/notification.job';

@Injectable()
export class JobExecutionService {

  constructor(
    private readonly notificationJob: NotificationJob
  ) {}

  private jobClasses = {};

  private async loadJobClasses() {
    // Register the Job classes here
    this.jobClasses['NotificationJob'] = this.notificationJob;

  }

  async executeJob(job) {
    const jobData = job.data;
    await this.loadJobClasses();
    let jobInstance = this.jobClasses[jobData.className];
    if (typeof jobInstance.handle === 'function') {
      jobInstance.data = jobData.data;
      await jobInstance.handle();
    } else {
      throw new Error('Job instance does not have a handle method.');
    }
  }
}

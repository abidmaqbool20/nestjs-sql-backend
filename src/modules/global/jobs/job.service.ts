import { Injectable } from '@nestjs/common';
import { InjectQueue, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueuableJob } from './job.interface';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class JobService {

  constructor(private readonly moduleRef: ModuleRef) {}

  async dispatch(job: QueuableJob): Promise<void> {
    if (job.shouldQueue) {
      const queueName = job.queue ?? 'default';
      job.className = job.constructor.name;

      try {
        const queue = await this.getQueueByName(queueName);
        await queue.add(queueName, job);
      } catch (error) {
        console.error(`Error in dispatching job to queue "${queueName}": ${error.message}`);
      }
    } else {
      console.log('Job is not queuable, running handle directly.');
      await job.handle();
    }
  }

  private async getQueueByName(queueName: string): Promise<Queue> {
    try {
      // Dynamically resolve the queue using ModuleRef
      return this.moduleRef.get<Queue>(getQueueToken(queueName), { strict: false });
    } catch (error) {
      throw new Error(`Queue with name "${queueName}" could not be found: ${error.message}`);
    }
  }

}

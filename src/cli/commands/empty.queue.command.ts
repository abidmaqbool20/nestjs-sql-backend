import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Queue, JobStatus } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Command } from '../command.interface';

type ExtendedJobStatus = JobStatus | 'all';

@Injectable()
export class EmptyQueueCommand implements Command {
  constructor(private readonly moduleRef: ModuleRef) { }

  async execute(args: string[]): Promise<void> {
    const queueName = args[0] || 'default';
    const queueStatus: ExtendedJobStatus = (args[1] as ExtendedJobStatus) || 'waiting';

    const queue = this.moduleRef.get<Queue>(
      getQueueToken(queueName),
      { strict: false },
    );

    if (!queue) {
      console.error(`Queue "${queueName}" not found`);
      return;
    }

    if (queueStatus === 'all') {
      await queue.obliterate({ force: true });
    } else {
      const jobs = await queue.getJobs([queueStatus]);
      await Promise.all(jobs.map(j => j.remove()));
    }

    console.log(`Queue "${queueName}" cleared`);
  }
}

/**
 * 👇 Commander metadata (THIS is what gets auto-loaded)
 */
export default {
  name: 'empty-queue [queueName] [queueStatus]',
  description: 'Empty a Bull queue (waiting, active, completed, failed, delayed, paused, all)',
  handler: EmptyQueueCommand,
};

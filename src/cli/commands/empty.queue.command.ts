import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Queue, JobStatus } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Command } from '../command.interface';

// Extend JobStatus to include 'all'
type ExtendedJobStatus = JobStatus | 'all';

@Injectable()
export class EmptyQueueCommand implements Command {
  constructor(private readonly moduleRef: ModuleRef) {}

  async execute(args: string[]): Promise<void> {
    try {
      const queueName = args[0] || 'default';
      const queueStatus: ExtendedJobStatus = args[1] as ExtendedJobStatus || 'waiting';

      console.log(`Attempting to clear queue: ${queueName}`);

      const queue = await this.getQueueByName(queueName);

      if (queue) {
        console.log(`Queue found: ${queueName}`);

        // Clear all jobs in the queue
        const jobCounts = await queue.getJobCounts();
        console.log(`Jobs before clearing:`, jobCounts);

        if (queueStatus !== 'all') {
          // Remove jobs by status
          await this.removeJobsByStatus(queue, queueStatus);
        } else {
          // Remove all jobs in all states
          await Promise.all([
            this.removeJobsByStatus(queue, 'waiting'),
            this.removeJobsByStatus(queue, 'active'),
            this.removeJobsByStatus(queue, 'completed'),
            this.removeJobsByStatus(queue, 'failed'),
            this.removeJobsByStatus(queue, 'delayed'),
            this.removeJobsByStatus(queue, 'paused'),
            queue.empty()  // Clears waiting, active, and delayed jobs
          ]);
        }

        console.log(`Queue "${queueName}" has been emptied.`);

        // Verify the queue is empty
        const jobCountsAfter = await queue.getJobCounts();
        console.log(`Jobs after clearing:`, jobCountsAfter);

      } else {
        console.log(`Queue "${queueName}" was not found.`);
      }
    } catch (error) {
      console.error(`Failed to empty queue: ${error.message}`);
    }
  }

  private async getQueueByName(queueName: string): Promise<Queue> {
    try {
      return this.moduleRef.get<Queue>(getQueueToken(queueName), { strict: false });
    } catch (error) {
      throw new Error(`Queue with name "${queueName}" could not be found: ${error.message}`);
    }
  }

  private async removeJobsByStatus(queue: Queue, status: JobStatus): Promise<void> {
    try {
      const jobs = await queue.getJobs([status]); // Retrieves jobs of the specified status
      await Promise.all(jobs.map(job => job.remove())); // Removes all retrieved jobs
    } catch (error) {
      console.error(`Failed to remove jobs with status "${status}": ${error.message}`);
    }
  }
}

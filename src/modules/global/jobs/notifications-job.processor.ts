import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JobExecutionService } from './job-execution.service';

@Processor('notifications')
export class NotificationsJobProcessor {

  constructor(
    private readonly jobExecutionService: JobExecutionService,
  ) {}

  @Process('notifications')
  async handleJob(job: Job): Promise<void> {
    this.jobExecutionService.executeJob(job);
  }
}

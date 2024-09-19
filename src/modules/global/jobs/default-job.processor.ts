import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { JobExecutionService } from './job-execution.service';

@Processor('default')
export class DefaultJobProcessor {

  constructor(
    private readonly jobExecutionService: JobExecutionService,
  ) {}

  @Process('default')
  async handleJob(job: Job): Promise<void> {
    this.jobExecutionService.executeJob(job);
  }
}

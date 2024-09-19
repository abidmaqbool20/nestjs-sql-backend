import { Module } from '@nestjs/common';
import { CliService } from './cli.service';
import { EmptyQueueCommand } from './commands/empty.queue.command';
import { ListQueueCommand } from './commands/list.queue.command';

@Module({
  providers: [
    CliService,
    EmptyQueueCommand,
    ListQueueCommand,
  ],
  exports: [CliService],
})
export class CliModule {}

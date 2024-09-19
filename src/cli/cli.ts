import { Command } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CliService } from './cli.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cliService = app.get(CliService);

  const program = new Command();

  // List all commands
  program
    .command('list-commands')
    .description('List all available CLI commands with descriptions')
    .action(() => {
      console.log('Available commands:');
      program.commands.forEach(cmd => {
        console.log(`- ${cmd.name()}: ${cmd.description()}`);
      });
      process.exit(0);
    });

  // List all queues
  program
    .command('list-queues')
    .description('List all Bull queues')
    .action(async () => {
      await cliService.executeCommand('ListQueueCommand');
      process.exit(0);
    });

  // Empty any queue
  program
    .command('empty-queue [queueName] [queueStatus]')
    .description('Empty a specific Bull queue with optional job status')
    .action(async (queueName: string = 'default', queueStatus: string = 'waiting') => {
      await cliService.executeCommand('EmptyQueueCommand', [queueName, queueStatus]);
      process.exit(0);
    });

  program.parse(process.argv);
}

bootstrap();

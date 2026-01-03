import { Command as Commander } from 'commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CliService } from './cli.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false, // ✅ suppress Nest logs
  });

  const cliService = app.get(CliService);
  const program = new Commander();

  const commandsDir = path.join(__dirname, 'commands');
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.command.js'));

  for (const file of files) {
    const mod = await import(path.join(commandsDir, file));
    const cmd = mod.default;

    program
      .command(cmd.name)
      .description(cmd.description)
      .action(async (...args: string[]) => {
        const instance = cliService.get(cmd.handler) as { execute: (args: string[]) => Promise<void> };
        await instance.execute(args);
        process.exit(0);
      });
  }

  program.parse(process.argv);
}

bootstrap();

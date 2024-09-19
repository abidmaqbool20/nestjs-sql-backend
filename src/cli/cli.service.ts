import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Command } from './command.interface';
import { EmptyQueueCommand } from './commands/empty.queue.command';
import { ListQueueCommand } from './commands/list.queue.command';

@Injectable()
export class CliService {
    private commands: { [key: string]: Command } = {};

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly listQueuesCommand: ListQueueCommand,
        private readonly emptyQueuesCommand: EmptyQueueCommand,
    ) {
        this.commands['ListQueueCommand'] = this.listQueuesCommand;
        this.commands['EmptyQueueCommand'] = this.emptyQueuesCommand;
    }

    async executeCommand(commandName: string, args?: string[]): Promise<void> {
        try {
            const command = this.commands[commandName];
            if (command) {
                console.log("**************COMMAND OUTPUT************")
                await command.execute(args);
            } else {
                console.error(`Command "${commandName}" not found.`);
            }
        } catch (error) {
            console.error(`Error executing command "${commandName}": ${error.message}`);
        }
    }
}

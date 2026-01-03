import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CliService {
    constructor(private readonly moduleRef: ModuleRef) { }

    get<T>(command: new (...args: any[]) => T): T {
        return this.moduleRef.get(command, { strict: false });
    }
}

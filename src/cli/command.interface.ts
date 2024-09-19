export interface Command {
    execute(args?: string[]): Promise<any>;
}

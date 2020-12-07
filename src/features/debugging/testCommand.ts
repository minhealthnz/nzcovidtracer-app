export interface TestCommand {
  command: string;
  title: string;
  description?: string;
  run(): Promise<void> | void;
}

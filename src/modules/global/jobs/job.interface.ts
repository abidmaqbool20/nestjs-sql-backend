export interface QueuableJob {
    data:any,
    className?: string; // Optional className name
    queue?: string; // Optional queue name
    shouldQueue: boolean; // Whether the job should be queued
    handle(): Promise<void>; // The method that will be executed
  }

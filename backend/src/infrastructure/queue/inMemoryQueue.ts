import type { AiJobData, AiJobName } from "./processor";

export type InMemoryJob = {
  id: string;
  name: AiJobName;
  data: AiJobData;
};

export type InMemoryQueue = {
  add: (name: AiJobName, data: AiJobData) => Promise<{ id: string }>;
};

let jobCounter = 0;

export const createInMemoryQueue = (
  processor: (job: InMemoryJob) => Promise<void>
): InMemoryQueue => {
  return {
    add: async (name, data) => {
      const job: InMemoryJob = {
        id: `mem-${Date.now()}-${++jobCounter}`,
        name,
        data
      };

      setImmediate(() => {
        processor(job).catch(err => {
          console.error("In-memory job failed", job.id, err);
        });
      });

      return { id: job.id };
    }
  };
};

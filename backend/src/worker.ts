import { Worker } from "bullmq";
import { connection } from "./infrastructure/queue/redis";
import { scoreProspects } from "./usecases/prospect/ScoreProspects";
import { generateOutreach } from "./usecases/outreach/GenerateOutreach";

const worker = new Worker(
  "ai-jobs",
  async job => {
    if (job.name === "score-prospects") {
      await scoreProspects(job.data.campaignId, job.data.userId, { useQueue: false });
      return;
    }

    if (job.name === "generate-outreach") {
      await generateOutreach(job.data.campaignId, job.data.userId, { useQueue: false });
      return;
    }
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error("Job failed", job?.id, err);
});

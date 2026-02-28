import app from "./app";
import { connectDB } from "./infrastructure/database/mongo";
import { env } from "./config/env";

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  const shutdown = () => {
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start().catch(err => {
  console.error("Failed to start server", err);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Unhandled Rejection", err);
});

process.on("uncaughtException", err => {
  console.error("Uncaught Exception", err);
  process.exit(1);
});

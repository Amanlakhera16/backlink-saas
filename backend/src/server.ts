import app from "./app";
import { connectDB } from "./infrastructure/database/mongo";
import { env } from "./config/env";

const start = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();
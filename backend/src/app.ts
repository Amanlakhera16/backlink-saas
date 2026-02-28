import express from "express";
import helmet from "helmet";
import cors from "cors"
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import campaignRoutes from "./routes/campaignRoutes";
import prospectRoutes from "./routes/prospectRoutes";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/prospects", prospectRoutes);

app.use(errorHandler);

export default app;
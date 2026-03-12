import "dotenv/config";
import cors from "cors";
import express from "express";
import appointmentRoutes from "./routes/appointmentRoutes";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

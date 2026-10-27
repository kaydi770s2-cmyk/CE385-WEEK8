import express from "express";
import { logger } from "./middlewares/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { studentsRouter } from "./routes/students.route.js";
export const app = express();
app.use(express.json());
app.use(logger);
app.get("/health", (_req, res) => {
res.json({ status: "ok" });
});

app.use("/api/v1/students", studentsRouter);
app.use(notFoundHandler);
app.use(errorHandler);
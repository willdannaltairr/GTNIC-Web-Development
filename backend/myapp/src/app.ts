import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { router } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: [env.frontendUrl, "http://localhost:3000"], credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.use("/api", router);
app.use(notFound as unknown as express.RequestHandler);
app.use(errorHandler as unknown as express.ErrorRequestHandler);

app.listen(env.port, () => {
  console.log(`[UP-API] listening on :${env.port} (midtrans ${env.midtransIsProduction ? "PRODUCTION" : "SANDBOX"})`);
});

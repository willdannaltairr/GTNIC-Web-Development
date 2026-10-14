import { env } from "./env.js";

export const midtransConfig = {
  serverKey: env.midtransServerKey,
  snapBase: env.midtransSnapBase.replace(/\/$/, ""),
  apiBase: env.midtransApiBase.replace(/\/$/, ""),
  isProduction: env.midtransIsProduction,
};

export function midtransAuthHeader(): string {
  return "Basic " + Buffer.from(midtransConfig.serverKey + ":").toString("base64");
}

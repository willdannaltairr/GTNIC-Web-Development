import { Router } from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import * as catalog from "../controllers/catalog.controller.js";
import * as orders from "../controllers/orders.controller.js";
import * as payments from "../controllers/payments.controller.js";
import * as tracking from "../controllers/tracking.controller.js";
import * as users from "../controllers/users.controller.js";

export const router = Router();

// Health publik
router.get("/health", (asyncHandler(async (_req, res) => {
  res.json({ success: true, data: { service: "up-taruna-bhakti-api", time: new Date().toISOString() } });
}) as unknown as import("express").RequestHandler));

// Referensi publik (katalog read + jurusan)
router.get("/jurusan", users.listJurusan as unknown as import("express").RequestHandler);
router.get("/catalog", catalog.listCatalog as unknown as import("express").RequestHandler);
router.get("/catalog/:id", catalog.getCatalogById as unknown as import("express").RequestHandler);

// Webhook Midtrans (tanpa auth, pakai signature)
router.post("/payments/webhook", payments.midtransWebhook as unknown as import("express").RequestHandler);

// ----- Butuh login -----
router.use(authRequired as unknown as import("express").RequestHandler);

router.get("/users/me", users.me as unknown as import("express").RequestHandler);
router.get("/orders/mine", orders.myOrders as unknown as import("express").RequestHandler);
router.post("/orders/checkout", orders.checkout as unknown as import("express").RequestHandler);
router.get("/orders/:id", orders.getOrderById as unknown as import("express").RequestHandler);
router.get("/orders/:orderId/tracking", tracking.listTracking as unknown as import("express").RequestHandler);
router.post("/orders/:orderId/tracking", tracking.addTracking as unknown as import("express").RequestHandler);

// Admin jurusan + super admin
router.post(
  "/catalog",
  requireRole("admin_jurusan", "super_admin") as unknown as import("express").RequestHandler,
  catalog.createCatalog as unknown as import("express").RequestHandler,
);
router.put(
  "/catalog/:id",
  requireRole("admin_jurusan", "super_admin") as unknown as import("express").RequestHandler,
  catalog.updateCatalog as unknown as import("express").RequestHandler,
);
router.delete(
  "/catalog/:id",
  requireRole("admin_jurusan", "super_admin") as unknown as import("express").RequestHandler,
  catalog.deleteCatalog as unknown as import("express").RequestHandler,
);
router.post(
  "/orders/:orderId/assign",
  requireRole("admin_jurusan", "super_admin") as unknown as import("express").RequestHandler,
  tracking.assignStudent as unknown as import("express").RequestHandler,
);
router.get(
  "/users",
  requireRole("admin_jurusan", "super_admin") as unknown as import("express").RequestHandler,
  users.listUsers as unknown as import("express").RequestHandler,
);
router.get(
  "/finance/summary",
  requireRole("admin_jurusan", "super_admin") as unknown as import("express").RequestHandler,
  payments.financeSummary as unknown as import("express").RequestHandler,
);

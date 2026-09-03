import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { globalErrorHandling } from "./Utils/Response.js";
import { langMiddleware } from "./Middlewares/i18n.js";
import { globalRateLimiter } from "./Middlewares/RateLimiter.js";
import {
  notificationQueue,
  redis,
  redisConnection,
} from "./Utils/Radis/Connection.js";
import rootRouter from "./index.routes.js";
import { Server } from "socket.io";
import { init_io } from "./Utils/Socket/index.js";
import { socketAuthentication } from "./Middlewares/SocketAuth.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { initGeoIP } from "./Utils/GeoIP.js";
import { swaggerSpec } from "./Utils/Swagger/swagger.js";

const bootstrap = async () => {
  const app = express();
  app.set("trust proxy", 1);
  const port = process.env.PORT || 3013;

  // Initialize GeoIP database in the background
  initGeoIP().catch((err) => {
    console.error("[GeoIP Init Error]", err);
  });

  // ── ENV DEBUG DUMP (remove after confirming env vars are correct) ──

  // ─────────────────────────────────────────────────────────────────
/*   const allJobs = await notificationQueue.getJobs([
    "waiting",
    "active",
    "delayed",
  ]);
  console.log("All jobs:", allJobs);  */

  const defaultOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://dashboard.mr-mahmoud.com",
    "https://mr-mahmoud.vercel.app",
    "https://mr-dashboard-lyart.vercel.app",
    "https://mr-mahmoud-front.vercel.app",
    "https://copy.agro-plus.net",
  ];

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
        .map((o) => o.trim().replace(/\/+$/, ""))
        .filter(Boolean)
    : defaultOrigins.map((o) => o.replace(/\/+$/, ""));

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, "");

      try {
        const url = new URL(normalizedOrigin);
        const isVercel = url.hostname.endsWith(".vercel.app");
        const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
        const isAgroPlus = url.hostname.endsWith("agro-plus.net");
        const isMrMahmoud = url.hostname.endsWith("mr-mahmoud.com");

        if (
          allowedOrigins.includes(normalizedOrigin) ||
          isVercel ||
          isLocal ||
          isAgroPlus ||
          isMrMahmoud
        ) {
          return callback(null, true);
        }
      } catch (err) {
        if (allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }
      }

      // Return false to reject CORS gracefully without throwing Express 500 error
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept-Language", "X-Requested-With", "timezone"],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(morgan("dev"));
  app.use(globalRateLimiter);
  app.use(express.json());
  app.use(langMiddleware); // Detect language for all requests
  await redisConnection();
  app.use("/uploads", express.static(path.resolve("./src/uploads")));

  // Swagger Documentation UI
  app.get("/docs/swagger.json", (req, res) => res.json(swaggerSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Root Router
  app.use(rootRouter);

  app.use(globalErrorHandling);

  const apphttp = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  // Initialize Socket.IO
  const io = new Server(apphttp, {
    cors: {
      origin: "*",
      credentials: true,
    },
    allowEIO3: true,
  });

  const pubClient = redis.duplicate();
  const subClient = redis.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);
  io.adapter(createAdapter(pubClient, subClient));

  io.use(socketAuthentication);

  init_io(io);
};
export default bootstrap;

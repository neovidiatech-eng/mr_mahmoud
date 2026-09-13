import { Router } from "express";
import authentication from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";
import * as controller from "./notifications.controller.js";
import * as schema from "./notifications.validation.js";

const router = Router();

router.use(authentication);

router.get(
  "/",
  validation(schema.getNotificationsQuery),
  controller.getNotifications,
);

router.get("/unread-count", controller.getUnreadCount);

router.patch(
  "/fcm-token",
  validation(schema.updateFcmTokenBody),
  controller.updateFcmToken,
);

router.post(
  "/fcm-token",
  validation(schema.updateFcmTokenBody),
  controller.updateFcmToken,
);

router.patch("/read-all", controller.markAllAsRead);

router.patch(
  "/:id/read",
  validation(schema.notificationIdParam),
  controller.markAsRead,
);

router.delete("/clear-all", controller.clearAllNotifications);

router.delete(
  "/:id",
  validation(schema.notificationIdParam),
  controller.deleteNotification,
);

router.post(
  "/",
  validation(schema.createNotificationBody),
  controller.createNotification,
);

export default router;

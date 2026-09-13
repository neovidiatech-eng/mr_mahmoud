import * as db from "../../database/dbService.js";
import { get_io } from "../../Utils/Socket/index.js";
import { sendPushNotification } from "../../Utils/Firebase/index.js";

/**
 * Format notification translations based on requested language
 */
const formatNotification = (notification, lang = "ar") => {
  const translations = notification.notificationTranslations || [];
  const matchedTranslation =
    translations.find((t) => t.lang === lang) ||
    translations.find((t) => t.lang === "ar") ||
    translations[0] ||
    {};

  return {
    id: notification.id,
    userId: notification.userId,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    title: matchedTranslation.title || "",
    message: matchedTranslation.message || "",
    translations,
  };
};

/**
 * Update FCM token for authenticated user
 */
export const updateFcmToken = async ({ userId, fcmToken }) => {
  const user = await db.updateOne({
    model: "user",
    where: { id: userId },
    data: { fcmToken },
  });

  return { success: true, userId: user.id, fcmToken: user.fcmToken };
};

/**
 * Fetch paginated notifications for user
 */
export const getUserNotifications = async ({
  userId,
  page = 1,
  limit = 20,
  isRead,
  lang = "ar",
}) => {
  const where = { userId };

  if (typeof isRead === "boolean") {
    where.isRead = isRead;
  }

  const { items, pagination } = await db.findManyWithPaginationAndCount({
    model: "notification",
    where,
    page,
    limit,
    orderBy: { createdAt: "desc" },
    include: {
      notificationTranslations: true,
    },
  });

  const unreadCount = await db.count({
    model: "notification",
    where: { userId, isRead: false },
  });

  const formattedItems = items.map((item) => formatNotification(item, lang));

  return {
    items: formattedItems,
    pagination,
    unreadCount,
  };
};

/**
 * Get count of unread notifications
 */
export const getUnreadCount = async ({ userId }) => {
  const unreadCount = await db.count({
    model: "notification",
    where: { userId, isRead: false },
  });

  return { unreadCount };
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async ({ id, userId, lang = "ar" }) => {
  const notification = await db.findFirst({
    model: "notification",
    where: { id, userId },
    include: { notificationTranslations: true },
  });

  if (!notification) {
    return null;
  }

  const updatedNotification = await db.updateOne({
    model: "notification",
    where: { id },
    data: { isRead: true },
    include: { notificationTranslations: true },
  });

  return formatNotification(updatedNotification, lang);
};

/**
 * Mark all notifications for user as read
 */
export const markAllAsRead = async ({ userId }) => {
  const result = await db.updateMany({
    model: "notification",
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  return { count: result.count };
};

/**
 * Delete a notification
 */
export const deleteNotification = async ({ id, userId }) => {
  const notification = await db.findFirst({
    model: "notification",
    where: { id, userId },
  });

  if (!notification) {
    return false;
  }

  await db.deleteOne({
    model: "notification",
    where: { id },
  });

  return true;
};

/**
 * Delete all notifications for user
 */
export const clearAllNotifications = async ({ userId }) => {
  const result = await db.deleteMany({
    model: "notification",
    where: { userId },
  });

  return { count: result.count };
};

/**
 * Create and dispatch a notification (to single user or array of users)
 */
export const createNotification = async ({
  userId,
  userIds,
  type,
  translations,
  title_ar,
  title_en,
  message_ar,
  message_en,
}) => {
  const targetUserIds = Array.isArray(userIds)
    ? userIds
    : userId
      ? [userId]
      : [];

  if (targetUserIds.length === 0) {
    return [];
  }

  let translationsList = translations;
  if (!translationsList || translationsList.length === 0) {
    translationsList = [];
    if (title_ar || message_ar) {
      translationsList.push({
        lang: "ar",
        title: title_ar || "",
        message: message_ar || "",
      });
    }
    if (title_en || message_en) {
      translationsList.push({
        lang: "en",
        title: title_en || "",
        message: message_en || "",
      });
    }
  }

  const createdNotifications = [];
  const io = get_io();

  for (const targetId of targetUserIds) {
    const notification = await db.create({
      model: "notification",
      data: {
        userId: targetId,
        type,
        isRead: false,
        notificationTranslations: {
          create: translationsList,
        },
      },
      include: {
        notificationTranslations: true,
      },
    });

    const formattedAr = formatNotification(notification, "ar");
    const formattedEn = formatNotification(notification, "en");
    createdNotifications.push(formattedAr);

    // Socket.io Realtime Broadcast
    if (io) {
      io.to(`user_${targetId}`).emit("notification:new", {
        ar: formattedAr,
        en: formattedEn,
        raw: notification,
      });
    }

    // FCM Push Notification
    try {
      const targetUser = await db.findFirst({
        model: "user",
        where: { id: targetId },
        select: { fcmToken: true },
      });

      if (targetUser?.fcmToken) {
        await sendPushNotification({
          fcmToken: targetUser.fcmToken,
          title: formattedAr.title || formattedEn.title || "Notification",
          body: formattedAr.message || formattedEn.message || "",
          data: {
            notificationId: notification.id,
            type: notification.type,
          },
        });
      }
    } catch (fcmError) {
      console.error(`FCM error for user ${targetId}:`, fcmError.message || fcmError);
    }
  }

  return createdNotifications;
};

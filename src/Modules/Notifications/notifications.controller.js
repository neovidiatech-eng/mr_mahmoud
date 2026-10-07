import { asyncHandler, successResponse, errorResponse } from "../../Utils/Response.js";
import * as notificationService from "./notifications.service.js";

/**
 * Update FCM Token for user device
 */
export const updateFcmToken = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { fcmToken } = req.body;

  const result = await notificationService.updateFcmToken({ userId, fcmToken });

  return successResponse({
    res,
    req,
    status: 200,
    message: "UPDATE_SUCCESS",
    data: result,
  });
});

/**
 * Get user notifications with pagination
 */
export const getNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const lang = req.lang || "ar";
  const { page, limit, isRead } = req.query;

  const result = await notificationService.getUserNotifications({
    userId,
    page,
    limit,
    isRead: isRead === undefined ? undefined : String(isRead) === "true",
    lang,
  });

  return successResponse({
    res,
    req,
    status: 200,
    message: "NOTIFICATIONS_FETCHED",
    data: result,
  });
});

/**
 * Get unread notifications count
 */
export const getUnreadCount = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const result = await notificationService.getUnreadCount({ userId });

  return successResponse({
    res,
    req,
    status: 200,
    message: "UNREAD_COUNT_FETCHED",
    data: result,
  });
});

/**
 * Mark a single notification as read
 */
export const markAsRead = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;
  const lang = req.lang || "ar";

  const updatedNotification = await notificationService.markAsRead({
    id,
    userId,
    lang,
  });

  if (!updatedNotification) {
    return errorResponse({
      req,
      next,
      status: 404,
      message: "NOTIFICATION_NOT_FOUND",
    });
  }

  return successResponse({
    res,
    req,
    status: 200,
    message: "NOTIFICATION_READ_SUCCESS",
    data: updatedNotification,
  });
});

/**
 * Mark all notifications as read
 */
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const result = await notificationService.markAllAsRead({ userId });

  return successResponse({
    res,
    req,
    status: 200,
    message: "ALL_NOTIFICATIONS_READ_SUCCESS",
    data: result,
  });
});

/**
 * Delete a single notification
 */
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id } = req.params;

  const success = await notificationService.deleteNotification({ id, userId });

  if (!success) {
    return errorResponse({
      req,
      next,
      status: 404,
      message: "NOTIFICATION_NOT_FOUND",
    });
  }

  return successResponse({
    res,
    req,
    status: 200,
    message: "NOTIFICATION_DELETED",
  });
});

/**
 * Clear all notifications for user
 */
export const clearAllNotifications = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const result = await notificationService.clearAllNotifications({ userId });

  return successResponse({
    res,
    req,
    status: 200,
    message: "ALL_NOTIFICATIONS_DELETED",
    data: result,
  });
});

/**
 * Create/send a notification (Admin / System endpoint)
 */
export const createNotification = asyncHandler(async (req, res, next) => {
  const {
    userId,
    userIds,
    type,
    translations,
    title_ar,
    title_en,
    message_ar,
    message_en,
  } = req.body;

  const result = await notificationService.createNotification({
    userId,
    userIds,
    type,
    translations,
    title_ar,
    title_en,
    message_ar,
    message_en,
  });

  return successResponse({
    res,
    req,
    status: 201,
    message: "NOTIFICATION_CREATED",
    data: result,
  });
});

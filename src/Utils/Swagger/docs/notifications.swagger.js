export const notificationsPaths = {
  "/notifications": {
    get: {
      tags: ["Notifications"],
      summary: "Get user notifications",
      description:
        "Returns a paginated list of notifications for the authenticated user, formatted based on the request language (header: accept-language or lang query/middleware). Optionally filter by read status.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          description: "Page number (defaults to 1)",
          schema: { type: "integer", example: 1 },
        },
        {
          name: "limit",
          in: "query",
          required: false,
          description: "Number of items per page (defaults to 20)",
          schema: { type: "integer", example: 20 },
        },
        {
          name: "isRead",
          in: "query",
          required: false,
          description: "Filter by read status (true or false)",
          schema: { type: "boolean", example: false },
        },
      ],
      responses: {
        200: {
          description: "Notifications fetched successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "NOTIFICATIONS_FETCHED" },
                  status: { type: "integer", example: 200 },
                  data: {
                    type: "object",
                    properties: {
                      items: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string", format: "uuid" },
                            userId: { type: "string", format: "uuid" },
                            type: { type: "string", example: "SESSION_REMINDER" },
                            isRead: { type: "boolean", example: false },
                            createdAt: { type: "string", format: "date-time" },
                            title: { type: "string", example: "تذكير بموعد الجلسة" },
                            message: { type: "string", example: "تبدأ الجلسة بعد 10 دقائق" },
                          },
                        },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          page: { type: "integer", example: 1 },
                          limit: { type: "integer", example: 20 },
                          totalItems: { type: "integer", example: 5 },
                          totalPages: { type: "integer", example: 1 },
                          hasNextPage: { type: "boolean", example: false },
                        },
                      },
                      unreadCount: { type: "integer", example: 3 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized — missing or invalid JWT bearer token." },
      },
    },
    post: {
      tags: ["Notifications"],
      summary: "Create and dispatch notification(s)",
      description:
        "Admin or System endpoint to create and push a notification to a single user or multiple users via Database, Socket.io, and Firebase FCM.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["type"],
              properties: {
                userId: {
                  type: "string",
                  format: "uuid",
                  description: "Single recipient user UUID",
                  example: "550e8400-e29b-41d4-a716-446655440000",
                },
                userIds: {
                  type: "array",
                  items: { type: "string", format: "uuid" },
                  description: "Array of recipient user UUIDs for broadcast",
                  example: ["550e8400-e29b-41d4-a716-446655440000"],
                },
                type: {
                  type: "string",
                  example: "SYSTEM_ANNOUNCEMENT",
                  description: "Notification type identifier",
                },
                title_ar: {
                  type: "string",
                  example: "تنبيه هائم من المنصة",
                  description: "Arabic Title",
                },
                title_en: {
                  type: "string",
                  example: "Important Platform Notice",
                  description: "English Title",
                },
                message_ar: {
                  type: "string",
                  example: "يرجى مراجعة الجدول الدراسي الجديد.",
                  description: "Arabic Message",
                },
                message_en: {
                  type: "string",
                  example: "Please check your updated class schedule.",
                  description: "English Message",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Notification created and dispatched successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "NOTIFICATION_CREATED" },
                  status: { type: "integer", example: 201 },
                  data: { type: "array", items: { type: "object" } },
                },
              },
            },
          },
        },
        400: { description: "Validation error — missing parameters." },
        401: { description: "Unauthorized." },
      },
    },
  },

  "/notifications/unread-count": {
    get: {
      tags: ["Notifications"],
      summary: "Get unread notifications count",
      description: "Returns total unread notifications count for authenticated user.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Unread count fetched successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "UNREAD_COUNT_FETCHED" },
                  status: { type: "integer", example: 200 },
                  data: {
                    type: "object",
                    properties: {
                      unreadCount: { type: "integer", example: 4 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized." },
      },
    },
  },

  "/notifications/fcm-token": {
    post: {
      tags: ["Notifications"],
      summary: "Register / update FCM token",
      description: "Registers or updates the Firebase Cloud Messaging device token for pushing native mobile/web alerts.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fcmToken: {
                  type: "string",
                  example: "fcm_device_token_string_here...",
                  description: "Firebase FCM device token",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "FCM token updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "UPDATE_SUCCESS" },
                  status: { type: "integer", example: 200 },
                  data: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      userId: { type: "string", format: "uuid" },
                      fcmToken: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized." },
      },
    },
    patch: {
      tags: ["Notifications"],
      summary: "Update FCM token",
      description: "Updates the FCM token for authenticated user's device.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fcmToken: {
                  type: "string",
                  example: "fcm_device_token_string_here...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "FCM token updated successfully." },
        401: { description: "Unauthorized." },
      },
    },
  },

  "/notifications/read-all": {
    patch: {
      tags: ["Notifications"],
      summary: "Mark all notifications as read",
      description: "Marks all unread notifications belonging to the authenticated user as read.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "All notifications marked as read.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "ALL_NOTIFICATIONS_READ_SUCCESS" },
                  status: { type: "integer", example: 200 },
                  data: {
                    type: "object",
                    properties: {
                      count: { type: "integer", example: 5 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized." },
      },
    },
  },

  "/notifications/{id}/read": {
    patch: {
      tags: ["Notifications"],
      summary: "Mark a single notification as read",
      description: "Marks a specific notification as read by UUID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the notification",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
        },
      ],
      responses: {
        200: {
          description: "Notification marked as read.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "NOTIFICATION_READ_SUCCESS" },
                  status: { type: "integer", example: 200 },
                  data: { type: "object" },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized." },
        404: { description: "NOTIFICATION_NOT_FOUND" },
      },
    },
  },

  "/notifications/clear-all": {
    delete: {
      tags: ["Notifications"],
      summary: "Clear all user notifications",
      description: "Permanently deletes all notifications belonging to the authenticated user.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "All notifications cleared.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "ALL_NOTIFICATIONS_DELETED" },
                  status: { type: "integer", example: 200 },
                  data: {
                    type: "object",
                    properties: {
                      count: { type: "integer", example: 12 },
                    },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized." },
      },
    },
  },

  "/notifications/{id}": {
    delete: {
      tags: ["Notifications"],
      summary: "Delete a single notification",
      description: "Deletes a specific notification by UUID.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the notification to delete",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440000" },
        },
      ],
      responses: {
        200: {
          description: "Notification deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "NOTIFICATION_DELETED" },
                  status: { type: "integer", example: 200 },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized." },
        404: { description: "NOTIFICATION_NOT_FOUND" },
      },
    },
  },
};

export const liveSessionPaths = {
  "/livesessions": {
    post: {
      tags: ["Live Sessions"],
      summary: "Create a new live session",
      description:
        "Creates a scheduled live session for a given plan and stage. Requires CREATE permission on LIVESESSION. Only one active (scheduled/live) session is allowed per plan at a time.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["stageId", "planId", "startAt"],
              properties: {
                stageId: {
                  type: "string",
                  format: "uuid",
                  example: "550e8400-e29b-41d4-a716-446655440000",
                  description: "UUID of the educational stage",
                },
                planId: {
                  type: "string",
                  format: "uuid",
                  example: "859bf2dd-38f1-4d3e-9608-ca7ca4699ce2",
                  description: "UUID of the subscription plan",
                },
                startAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-09-10T18:00:00.000Z",
                  description: "Scheduled start date/time of the live session (ISO 8601)",
                },
                title: {
                  type: "string",
                  example: "Math Revision — Chapter 5",
                  description: "Optional human-readable title for the session",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Live session created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  planId: { type: "string", format: "uuid" },
                  stageId: { type: "string", format: "uuid" },
                  userId: { type: "string", format: "uuid" },
                  title: { type: "string", example: "Math Revision — Chapter 5" },
                  roomName: { type: "string", example: "live-<planId>-<stageId>-<timestamp>" },
                  startAt: { type: "string", format: "date-time" },
                  status: {
                    type: "string",
                    enum: ["scheduled", "live", "ended", "cancelled"],
                    example: "scheduled",
                  },
                },
              },
            },
          },
        },
        400: { description: "Validation error — missing or invalid fields." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: { description: "Forbidden — insufficient permissions." },
        404: { description: "PLAN_NOT_FOUND | STAGE_NOT_FOUND" },
        409: {
          description:
            "PLAN_ALREADY_HAS_A_LIVE_SESSION — the plan already has an active or scheduled live session.",
        },
      },
    },
    get: {
      tags: ["Live Sessions"],
      summary: "Get all live sessions",
      description:
        "Returns a paginated list of all live sessions, optionally filtered by title. Requires READ permission on LIVESESSION.",
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
          description: "Number of results per page (defaults to 10)",
          schema: { type: "integer", example: 10 },
        },
        {
          name: "search",
          in: "query",
          required: false,
          description: "Filter sessions by title (case-insensitive partial match)",
          schema: { type: "string", example: "Math" },
        },
      ],
      responses: {
        200: {
          description: "Paginated list of live sessions.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        title: { type: "string" },
                        roomName: { type: "string" },
                        startAt: { type: "string", format: "date-time" },
                        status: {
                          type: "string",
                          enum: ["scheduled", "live", "ended", "cancelled"],
                        },
                        plan: { type: "object" },
                        stage: { type: "object" },
                      },
                    },
                  },
                  total: { type: "integer", example: 42 },
                  page: { type: "integer", example: 1 },
                  limit: { type: "integer", example: 10 },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized — missing or invalid token." },
        403: { description: "Forbidden — insufficient permissions." },
      },
    },
  },

  "/livesessions/{id}": {
    get: {
      tags: ["Live Sessions"],
      summary: "Get a single live session",
      description:
        "Retrieves the full details of a specific live session by its UUID, including its associated plan and stage. Requires READ permission on LIVESESSION.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the live session",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
        },
      ],
      responses: {
        200: {
          description: "Live session details.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  roomName: { type: "string" },
                  startAt: { type: "string", format: "date-time" },
                  status: {
                    type: "string",
                    enum: ["scheduled", "live", "ended", "cancelled"],
                  },
                  plan: { type: "object" },
                  stage: { type: "object" },
                },
              },
            },
          },
        },
        400: { description: "Validation error — invalid session ID format." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: { description: "Forbidden — insufficient permissions." },
        404: { description: "LIVE_SESSION_NOT_FOUND" },
      },
    },
    patch: {
      tags: ["Live Sessions"],
      summary: "Update a live session",
      description:
        "Updates the details of a scheduled live session. Only the session owner can update it, and only while its status is `scheduled`. Requires UPDATE permission on LIVESESSION.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the live session to update",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                stageId: {
                  type: "string",
                  format: "uuid",
                  example: "550e8400-e29b-41d4-a716-446655440000",
                  description: "UUID of the new educational stage",
                },
                planId: {
                  type: "string",
                  format: "uuid",
                  example: "859bf2dd-38f1-4d3e-9608-ca7ca4699ce2",
                  description: "UUID of the new subscription plan",
                },
                startAt: {
                  type: "string",
                  format: "date-time",
                  example: "2026-09-15T18:00:00.000Z",
                  description: "New scheduled start date/time (ISO 8601)",
                },
                title: {
                  type: "string",
                  example: "Math Revision — Chapter 6",
                  description: "New human-readable title for the session",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Live session updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  planId: { type: "string", format: "uuid" },
                  stageId: { type: "string", format: "uuid" },
                  userId: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  roomName: { type: "string" },
                  startAt: { type: "string", format: "date-time" },
                  status: {
                    type: "string",
                    enum: ["scheduled", "live", "ended", "cancelled"],
                    example: "scheduled",
                  },
                },
              },
            },
          },
        },
        400: { description: "Validation error — missing or invalid fields." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: {
          description:
            "Forbidden — YOU_ARE_NOT_AUTHORIZED_TO_UPDATE_THIS_LIVE_SESSION (not the session owner), or LIVE_SESSION_CANNOT_BE_UPDATED (session is not in `scheduled` status).",
        },
        404: { description: "LIVE_SESSION_NOT_FOUND | PLAN_NOT_FOUND | STAGE_NOT_FOUND" },
      },
    },
    delete: {
      tags: ["Live Sessions"],
      summary: "Delete a live session",
      description:
        "Permanently deletes a live session. Sessions with status `live` cannot be deleted. Requires DELETE permission on LIVESESSION.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the live session to delete",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
        },
      ],
      responses: {
        200: { description: "Live session deleted successfully." },
        400: { description: "Validation error — invalid session ID format." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: { description: "Forbidden — insufficient permissions or LIVE_SESSION_CANNOT_BE_DELETED (session is currently `live`)." },
        404: { description: "LIVE_SESSION_NOT_FOUND" },
      },
    },
  },

  "/livesessions/{id}/start": {
    patch: {
      tags: ["Live Sessions"],
      summary: "Start a live session",
      description:
        "Transitions a live session from `scheduled` to `live` status. Only the session owner (teacher) can start their own session. Requires START permission on LIVESESSION.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the live session to start",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
        },
      ],
      responses: {
        200: {
          description: "Live session started successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  roomName: { type: "string" },
                  startAt: { type: "string", format: "date-time" },
                  status: {
                    type: "string",
                    enum: ["scheduled", "live", "ended", "cancelled"],
                    example: "live",
                  },
                },
              },
            },
          },
        },
        400: { description: "Validation error — invalid session ID format." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: {
          description:
            "Forbidden — YOU_ARE_NOT_AUTHORIZED_TO_START_THIS_LIVE_SESSION (not the session owner), or LIVE_SESSION_ALREADY_STARTED (already `live`), or LIVE_SESSION_ENDED (already ended/cancelled).",
        },
        404: { description: "LIVE_SESSION_NOT_FOUND" },
      },
    },
  },

  "/livesessions/{id}/end": {
    patch: {
      tags: ["Live Sessions"],
      summary: "End a live session",
      description:
        "Transitions a live session to `ended` status and records the end timestamp. Only the session owner can end their own session. Requires END permission on LIVESESSION.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the live session to end",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
        },
      ],
      responses: {
        200: {
          description: "Live session ended successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  title: { type: "string" },
                  roomName: { type: "string" },
                  startAt: { type: "string", format: "date-time" },
                  endedAt: { type: "string", format: "date-time", description: "Timestamp when the session was ended" },
                  status: {
                    type: "string",
                    enum: ["scheduled", "live", "ended", "cancelled"],
                    example: "ended",
                  },
                },
              },
            },
          },
        },
        400: { description: "Validation error — invalid session ID format." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: {
          description:
            "Forbidden — YOU_ARE_NOT_AUTHORIZED_TO_END_THIS_LIVE_SESSION (not the session owner), or LIVE_SESSION_ALREADY_ENDED_OR_CANCELLED.",
        },
        404: { description: "LIVE_SESSION_NOT_FOUND" },
      },
    },
  },

  "/livesessions/{id}/join": {
    patch: {
      tags: ["Live Sessions"],
      summary: "Join a live session",
      description:
        "Generates a Jitsi JWT token granting access to the live session room. Teachers joining their own session get moderator privileges. Students must be enrolled in the plan/stage and have available session credits. Attendance is recorded automatically on first join.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "UUID of the live session to join",
          schema: { type: "string", format: "uuid", example: "550e8400-e29b-41d4-a716-446655440001" },
        },
      ],
      responses: {
        200: {
          description: "Joined live session successfully — returns Jitsi token and room name.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    description: "Jitsi JWT token to authenticate with the video room",
                    example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  roomName: {
                    type: "string",
                    description: "Jitsi room name the client should join",
                    example: "live-859bf2dd-550e8400-1725984000000",
                  },
                },
              },
            },
          },
        },
        400: { description: "Validation error — invalid session ID format." },
        401: { description: "Unauthorized — missing or invalid token." },
        403: {
          description:
            "Forbidden — YOU_ARE_NOT_AUTHORIZED_TO_JOIN_THIS_LIVE_SESSION (teacher joining another's session, or student not enrolled in the plan/stage).",
        },
        404: { description: "LIVE_SESSION_NOT_FOUND | PLAN_NOT_FOUND | USER_NOT_FOUND" },
        410: { description: "LIVE_SESSION_ENDED — the session has already ended or been cancelled." },
        429: { description: "LIVE_SESSIONS_LIMIT_REACHED — student has used all allowed live session credits for this plan." },
      },
    },
  },
};

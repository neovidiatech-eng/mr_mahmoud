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

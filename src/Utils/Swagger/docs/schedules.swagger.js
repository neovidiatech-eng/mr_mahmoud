export const schedulesPaths = {
  "/schedules": {
    get: {
      tags: ["Schedules"],
      summary: "Get all schedules / live sessions",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Schedules retrieved." } }
    },
    patch: {
      tags: ["Schedules"],
      summary: "Update schedule",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Schedule updated." } }
    }
  },
  "/schedules/reviews": {
    get: {
      tags: ["Schedules Reviews"],
      summary: "Get session reviews",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Session reviews retrieved." } }
    }
  },
  "/schedules/reviews/{id}/visibility": {
    patch: {
      tags: ["Schedules Reviews"],
      summary: "Toggle review visibility",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Review visibility updated." } }
    }
  },
  "/schedules/user/schedules": {
    get: {
      tags: ["Schedules"],
      summary: "Get logged-in user schedules",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "User schedules retrieved." } }
    }
  },
  "/schedules/create-one": {
    post: {
      tags: ["Schedules"],
      summary: "Create single schedule session",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "startTime", "endTime"],
              properties: {
                title: { type: "string", example: "Physics Chapter 1 Live" },
                startTime: { type: "string", format: "date-time" },
                endTime: { type: "string", format: "date-time" },
                subjectId: { type: "string" },
                teacherId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Schedule session created." } }
    }
  },
  "/schedules/create-recurring": {
    post: {
      tags: ["Schedules"],
      summary: "Create recurring schedule sessions",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "repeatDays", "startDate", "endDate"],
              properties: {
                title: { type: "string" },
                repeatDays: { type: "array", items: { type: "string" }, example: ["MONDAY", "WEDNESDAY"] },
                startDate: { type: "string", format: "date" },
                endDate: { type: "string", format: "date" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Recurring schedules created." } }
    }
  },
  "/schedules/{id}": {
    get: {
      tags: ["Schedules"],
      summary: "Get schedule details by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Schedule details retrieved." } }
    },
    delete: {
      tags: ["Schedules"],
      summary: "Delete single schedule session",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Schedule deleted." } }
    }
  },
  "/schedules/group/{parent_recurring_id}": {
    delete: {
      tags: ["Schedules"],
      summary: "Delete recurring group of schedules",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "parent_recurring_id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Schedule group deleted." } }
    }
  },
  "/schedules/change-instructor/{id}": {
    patch: {
      tags: ["Schedules"],
      summary: "Change instructor for schedule session",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["teacherId"],
              properties: { teacherId: { type: "string" } }
            }
          }
        }
      },
      responses: { 200: { description: "Instructor updated." } }
    }
  },
  "/schedules/{id}/join": {
    post: {
      tags: ["Schedules Session Lifecycle"],
      summary: "Join live session",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Joined live session." } }
    }
  },
  "/schedules/{id}/leave": {
    post: {
      tags: ["Schedules Session Lifecycle"],
      summary: "Leave live session",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Left live session." } }
    }
  },
  "/schedules/{id}/review": {
    post: {
      tags: ["Schedules Reviews"],
      summary: "Submit review for session",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["rating"],
              properties: {
                rating: { type: "number", minimum: 1, maximum: 5, example: 5 },
                comment: { type: "string", example: "Great session!" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Review submitted." } }
    }
  }
};

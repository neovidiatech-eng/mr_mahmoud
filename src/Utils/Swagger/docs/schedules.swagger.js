export const schedulesPaths = {
  "/schedules": {
    get: {
      tags: ["Schedules"],
      summary: "Get all schedules / live sessions",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Schedules retrieved." } }
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
              required: ["platform", "teacherId", "courseId", "title", "link", "start_time", "type", "notification_Time"],
              properties: {
                title: { type: "string", example: "Physics Chapter 1 Live Session" },
                description: { type: "string", example: "Discussion on kinematics" },
                platform: { type: "string", example: "zoom" },
                teacherId: { type: "string" },
                courseId: { type: "string" },
                subjectId: { type: "string" },
                link: { type: "string", example: "https://zoom.us/j/123456789" },
                notes: { type: "string" },
                start_time: { type: "string", format: "date-time" },
                type: { type: "string", example: "individual" },
                language: { type: "string", enum: ["en", "ar", "fr"], default: "en" },
                videoUrl: { type: "string" },
                slidesUrl: { type: "string" },
                notification_Time: { type: "string", example: "15m" },
                studentId: { type: "string" },
                studentIds: { type: "array", items: { type: "string" } },
                isGroup: { type: "boolean", default: false },
                maxStudents: { type: "string", default: "1" }
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
              required: ["teacherId", "courseId", "link", "startTime", "days", "startDate", "endDate", "notification_Time"],
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                teacherId: { type: "string" },
                courseId: { type: "string" },
                subjectId: { type: "string" },
                link: { type: "string", example: "https://zoom.us/j/123456789" },
                notes: { type: "string" },
                startTime: { type: "string", example: "18:00", description: "Time in HH:mm format" },
                days: {
                  type: "array",
                  items: {
                    type: "string",
                    enum: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                  },
                  example: ["Sunday", "Wednesday"]
                },
                startDate: { type: "string", format: "date" },
                endDate: { type: "string", format: "date" },
                notification_Time: { type: "string", example: "15m" },
                language: { type: "string", enum: ["en", "ar", "fr"], default: "en" },
                videoUrl: { type: "string" },
                studentId: { type: "string" },
                studentIds: { type: "array", items: { type: "string" } },
                isGroup: { type: "boolean", default: false },
                maxStudents: { type: "string", default: "1" }
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
    patch: {
      tags: ["Schedules"],
      summary: "Update schedule",
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
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                subjectId: { type: "string" },
                link: { type: "string" },
                notes: { type: "string" },
                status: { type: "string", enum: ["planned", "completed", "missed", "cancelled"] },
                start_time: { type: "string", format: "date-time" },
                type: { type: "string" },
                language: { type: "string", enum: ["en", "ar", "fr"] },
                videoUrl: { type: "string" },
                slidesUrl: { type: "string" },
                notification_Time: { type: "string" },
                instractor: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Schedule updated." } }
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
              required: ["rating", "comment", "teacherAttended", "studentAttended"],
              properties: {
                rating: { type: "number", minimum: 1, maximum: 5, example: 5 },
                comment: { type: "string", example: "Great session!" },
                teacherAttended: { type: "boolean", default: true },
                studentAttended: { type: "boolean", default: true }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Review submitted." } }
    }
  }
};

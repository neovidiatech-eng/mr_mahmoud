export const requestsPaths = {
  "/requests": {
    get: {
      tags: ["Requests"],
      summary: "Get all requests (Admin / System)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "status", in: "query", schema: { type: "string", enum: ["pending", "approved", "rejected"] } }
      ],
      responses: {
        200: { description: "All requests retrieved successfully." }
      }
    },
    post: {
      tags: ["Requests"],
      summary: "Create a request",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["type", "reason"],
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "reschedule",
                    "cancel",
                    "absence_correction",
                    "new_session",
                    "vacation",
                    "sick_leave",
                    "excuse",
                    "emergency",
                    "resign",
                    "technical_issue"
                  ],
                  example: "reschedule"
                },
                reason: { type: "string", example: "Need to reschedule session due to medical appointment" },
                sessionId: { type: "string" },
                priority: { type: "string", enum: ["low", "medium", "high"], default: "medium" },
                title: { type: "string" },
                attachments: {
                  type: "array",
                  items: { type: "string", format: "binary" },
                  description: "Attachment files"
                },
                requestedData: {
                  type: "object",
                  properties: {
                    new_start_time: { type: "string", format: "date-time" },
                    new_end_time: { type: "string", format: "date-time" },
                    new_status: { type: "string", enum: ["completed", "missed"] },
                    suggested_notes: { type: "string" },
                    studentId: { type: "string" },
                    teacherId: { type: "string" },
                    courseId: { type: "string" },
                    title: { type: "string" }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: "Request created successfully." }
      }
    }
  },
  "/requests/my": {
    get: {
      tags: ["Requests"],
      summary: "Get logged-in user requests",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "User requests retrieved successfully." }
      }
    }
  },
  "/requests/{id}/approve": {
    patch: {
      tags: ["Requests"],
      summary: "Approve a request",
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
                adminNotes: { type: "string", example: "Approved by admin" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Request approved." }
      }
    }
  },
  "/requests/{id}/reject": {
    patch: {
      tags: ["Requests"],
      summary: "Reject a request",
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
                adminNotes: { type: "string", example: "Rejected due to policy" }
              }
            }
          }
        }
      },
      responses: {
        200: { description: "Request rejected." }
      }
    }
  }
};

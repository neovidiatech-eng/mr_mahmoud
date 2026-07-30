export const requestsPaths = {
  "/requests": {
    get: {
      tags: ["Requests"],
      summary: "Get all requests (Admin / System)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        { name: "status", in: "query", schema: { type: "string", enum: ["PENDING", "APPROVED", "REJECTED"] } }
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
          "application/json": {
            schema: {
              type: "object",
              required: ["type", "description"],
              properties: {
                type: { type: "string", example: "COURSE_ACCESS" },
                description: { type: "string", example: "Requesting access to Advanced Physics Course" },
                targetId: { type: "string" }
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
      responses: {
        200: { description: "Request rejected." }
      }
    }
  }
};

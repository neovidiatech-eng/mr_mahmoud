export const coursePurchaseRequestsPaths = {
  "/course-purchase-requests": {
    get: {
      tags: ["Course Purchase Requests"],
      summary: "Get all course purchase requests",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "status", in: "query", schema: { type: "string", enum: ["pending", "approved", "rejected"] } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1 } }
      ],
      responses: { 200: { description: "Course purchase requests retrieved." } }
    },
    post: {
      tags: ["Course Purchase Requests"],
      summary: "Submit course purchase request",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["courseId"],
              properties: {
                courseId: { type: "string" },
                notes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Request submitted." } }
    }
  },
  "/course-purchase-requests/{id}/status": {
    patch: {
      tags: ["Course Purchase Requests"],
      summary: "Update purchase request status (Approve / Reject)",
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
              required: ["status"],
              properties: {
                status: { type: "string", enum: ["approved", "rejected"] },
                notes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Status updated." } }
    }
  }
};

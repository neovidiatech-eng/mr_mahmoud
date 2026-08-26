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
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["name", "phone", "email"],
              properties: {
                name: { type: "string", example: "Ahmed Ali", description: "Purchaser name" },
                phone: { type: "string", example: "01000000000", description: "Purchaser phone number" },
                email: { type: "string", format: "email", example: "ahmed@example.com", description: "Purchaser email address" },
                courseId: { type: "string", format: "uuid", description: "Single course ID" },
                courseIds: { type: "array", items: { type: "string", format: "uuid" }, description: "Array of course IDs for cart purchases" },
                parentPhone: { type: "string", example: "01100000000", description: "Parent phone number (optional)" },
                notes: { type: "string", description: "Additional notes" },
                image: { type: "string", format: "binary", description: "Payment receipt proof image (optional)" }
              }
            }
          },
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "phone", "email"],
              properties: {
                name: { type: "string", example: "Ahmed Ali", description: "Purchaser name" },
                phone: { type: "string", example: "01000000000", description: "Purchaser phone number" },
                email: { type: "string", format: "email", example: "ahmed@example.com", description: "Purchaser email address" },
                courseId: { type: "string", format: "uuid" },
                courseIds: { type: "array", items: { type: "string", format: "uuid" } },
                parentPhone: { type: "string", example: "01100000000" },
                notes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Request submitted successfully." } }
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

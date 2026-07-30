export const policiesPaths = {
  "/policies": {
    get: {
      tags: ["Policies & Notices"],
      summary: "Get all platform policies",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Policies list retrieved." } }
    },
    post: {
      tags: ["Policies & Notices"],
      summary: "Create policy (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "content"],
              properties: {
                title: { type: "string" },
                content: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Policy created." } }
    }
  },
  "/policies/notice": {
    get: {
      tags: ["Policies & Notices"],
      summary: "Get active platform notice",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Active notice retrieved." } }
    },
    post: {
      tags: ["Policies & Notices"],
      summary: "Create / Update platform notice (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["message"],
              properties: {
                message: { type: "string" },
                isActive: { type: "boolean", default: true }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Notice saved." } }
    }
  },
  "/policies/{id}": {
    patch: {
      tags: ["Policies & Notices"],
      summary: "Update policy",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Policy updated." } }
    },
    delete: {
      tags: ["Policies & Notices"],
      summary: "Delete policy",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Policy deleted." } }
    }
  }
};

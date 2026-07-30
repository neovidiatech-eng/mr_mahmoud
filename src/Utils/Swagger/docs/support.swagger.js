export const supportPaths = {
  "/support": {
    get: {
      tags: ["Support Tickets"],
      summary: "Get support tickets",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Support tickets retrieved." } }
    },
    post: {
      tags: ["Support Tickets"],
      summary: "Create support ticket",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["subject", "message", "categoryId"],
              properties: {
                subject: { type: "string" },
                message: { type: "string" },
                categoryId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Support ticket created." } }
    }
  },
  "/support/teacher": {
    get: {
      tags: ["Support Tickets"],
      summary: "Get support tickets for teacher",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Teacher support tickets retrieved." } }
    }
  },
  "/support/categories": {
    get: {
      tags: ["Support Categories"],
      summary: "Get support categories",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Categories list retrieved." } }
    },
    post: {
      tags: ["Support Categories"],
      summary: "Create support category",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: { name: { type: "string" } }
            }
          }
        }
      },
      responses: { 201: { description: "Support category created." } }
    }
  },
  "/support/{id}": {
    get: {
      tags: ["Support Tickets"],
      summary: "Get support ticket details",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Ticket details retrieved." } }
    },
    patch: {
      tags: ["Support Tickets"],
      summary: "Update support ticket status",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Ticket updated." } }
    },
    delete: {
      tags: ["Support Tickets"],
      summary: "Delete support ticket",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Ticket deleted." } }
    }
  },
  "/support/categories/{id}": {
    patch: {
      tags: ["Support Categories"],
      summary: "Update support category",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Category updated." } }
    },
    delete: {
      tags: ["Support Categories"],
      summary: "Delete support category",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Category deleted." } }
    }
  }
};

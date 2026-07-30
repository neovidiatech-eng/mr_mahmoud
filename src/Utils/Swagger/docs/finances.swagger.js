export const financesPaths = {
  "/finances/expenses": {
    get: {
      tags: ["Finances & Expenses"],
      summary: "Get expenses list",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } }
      ],
      responses: { 200: { description: "Expenses list retrieved." } }
    },
    post: {
      tags: ["Finances & Expenses"],
      summary: "Record new expense",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "amount", "category"],
              properties: {
                title: { type: "string", example: "Server hosting fee" },
                amount: { type: "number", example: 150.00 },
                category: { type: "string", example: "INFRASTRUCTURE" },
                notes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Expense recorded." } }
    }
  },
  "/finances/expenses/{id}": {
    get: {
      tags: ["Finances & Expenses"],
      summary: "Get expense by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Expense details retrieved." } }
    },
    patch: {
      tags: ["Finances & Expenses"],
      summary: "Update expense",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Expense updated." } }
    },
    delete: {
      tags: ["Finances & Expenses"],
      summary: "Delete expense",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Expense deleted." } }
    }
  }
};

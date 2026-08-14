export const financesPaths = {
  "/finances/expenses": {
    get: {
      tags: ["Finances & Expenses"],
      summary: "Get expenses list",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "search", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string", enum: ["paid", "unpaid", "pending"] } },
        { name: "type", in: "query", schema: { type: "string", enum: ["salary", "amenities", "general", "management", "marketing", "other"] } },
        { name: "page", in: "query", schema: { type: "integer", minimum: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", minimum: 1 } }
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
              required: ["title", "currencyId", "amount", "payment_type", "type", "status", "date"],
              properties: {
                title: { type: "string", example: "Server hosting fee" },
                currencyId: { type: "string", example: "EGP" },
                amount: { type: "number", example: 150.00 },
                payment_type: { type: "string", example: "bank_transfer" },
                type: { type: "string", enum: ["salary", "amenities", "general", "management", "marketing", "other"], example: "general" },
                status: { type: "string", enum: ["paid", "unpaid", "pending"], example: "paid" },
                date: { type: "string", format: "date-time" }
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
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                currencyId: { type: "string" },
                amount: { type: "number" },
                payment_type: { type: "string" },
                type: { type: "string", enum: ["salary", "amenities", "general", "management", "marketing", "other"] },
                status: { type: "string", enum: ["paid", "unpaid", "pending"] },
                date: { type: "string", format: "date-time" }
              }
            }
          }
        }
      },
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

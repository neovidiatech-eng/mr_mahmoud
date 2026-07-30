export const transactionsPaths = {
  "/transactions": {
    get: {
      tags: ["Transactions"],
      summary: "Get system transactions list (Admin)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } }
      ],
      responses: { 200: { description: "Transactions list retrieved." } }
    }
  },
  "/transactions/stats": {
    get: {
      tags: ["Transactions"],
      summary: "Get financial transaction statistics",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Transaction statistics retrieved." } }
    }
  },
  "/transactions/currency/currencies": {
    get: {
      tags: ["Transactions Currency"],
      summary: "Get supported currencies",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Currencies list retrieved." } }
    }
  },
  "/transactions/currency/add-currency": {
    post: {
      tags: ["Transactions Currency"],
      summary: "Add new currency (Admin)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["code", "name", "symbol", "exchangeRate"],
              properties: {
                code: { type: "string", example: "EGP" },
                name: { type: "string", example: "Egyptian Pound" },
                symbol: { type: "string", example: "LE" },
                exchangeRate: { type: "number", example: 1.0 }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Currency added." } }
    }
  },
  "/transactions/currency/{id}": {
    get: {
      tags: ["Transactions Currency"],
      summary: "Get currency by ID",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Currency details retrieved." } }
    }
  },
  "/transactions/currency/update-currency/{id}": {
    patch: {
      tags: ["Transactions Currency"],
      summary: "Update currency details",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Currency updated." } }
    }
  },
  "/transactions/currency/delete-currency/{id}": {
    delete: {
      tags: ["Transactions Currency"],
      summary: "Delete currency",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Currency deleted." } }
    }
  }
};

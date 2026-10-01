export const withdrawalsPaths = {
  "/withdrawals": {
    get: {
      tags: ["Withdrawals"],
      summary: "Get withdrawals list for current user",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Withdrawals retrieved." } }
    }
  },
  "/withdrawals/all": {
    get: {
      tags: ["Withdrawals"],
      summary: "Get all platform withdrawals (Admin)",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "All withdrawals retrieved." } }
    }
  },
  "/withdrawals/request": {
    post: {
      tags: ["Withdrawals"],
      summary: "Request wallet withdrawal",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["amount"],
              properties: {
                amount: { type: "number", example: 500.00 }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Withdrawal request submitted." } }
    }
  },
  "/withdrawals/{id}/approve": {
    patch: {
      tags: ["Withdrawals"],
      summary: "Approve withdrawal request (Admin)",
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
                adminNotes: { type: "string", example: "Approved and sent via Vodafone Cash" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Withdrawal approved." } }
    }
  },
  "/withdrawals/{id}/reject": {
    patch: {
      tags: ["Withdrawals"],
      summary: "Reject withdrawal request (Admin)",
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
                adminNotes: { type: "string", example: "Insufficient balance" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Withdrawal rejected." } }
    }
  }
};

export const chatPaths = {
  "/chat/conversations": {
    get: {
      tags: ["Chat"],
      summary: "Get logged-in user conversations",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Conversations list retrieved." } }
    },
    post: {
      tags: ["Chat"],
      summary: "Start new conversation",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["recipientId"],
              properties: {
                recipientId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Conversation created or retrieved." } }
    }
  },
  "/chat/conversations/{id}/messages": {
    get: {
      tags: ["Chat"],
      summary: "Get conversation messages",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } }
      ],
      responses: { 200: { description: "Messages list retrieved." } }
    },
    post: {
      tags: ["Chat"],
      summary: "Send message in conversation",
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
              required: ["content"],
              properties: {
                content: { type: "string", example: "Hello, teacher!" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Message sent." } }
    }
  }
};

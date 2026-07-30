export const homeworkPaths = {
  "/homework": {
    get: {
      tags: ["Homework"],
      summary: "Get all homework assignments",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer" } },
        { name: "limit", in: "query", schema: { type: "integer" } }
      ],
      responses: { 200: { description: "Homework assignments retrieved." } }
    },
    post: {
      tags: ["Homework"],
      summary: "Create homework assignment",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "dueDate", "subjectId"],
              properties: {
                title: { type: "string", example: "Math Homework 1" },
                description: { type: "string" },
                dueDate: { type: "string", format: "date-time" },
                subjectId: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 201: { description: "Homework created." } }
    }
  },
  "/homework/student-homework": {
    get: {
      tags: ["Homework"],
      summary: "Get homework assigned to logged-in student",
      security: [{ bearerAuth: [] }],
      responses: { 200: { description: "Student homework assignments retrieved." } }
    }
  },
  "/homework/student/{id}": {
    get: {
      tags: ["Homework"],
      summary: "Get homework details by ID for student",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Homework details retrieved." } }
    }
  },
  "/homework/{id}": {
    patch: {
      tags: ["Homework"],
      summary: "Update homework assignment",
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
                description: { type: "string" },
                dueDate: { type: "string", format: "date-time" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Homework updated." } }
    },
    delete: {
      tags: ["Homework"],
      summary: "Delete homework assignment",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: { 200: { description: "Homework deleted." } }
    }
  },
  "/homework/{id}/submit": {
    post: {
      tags: ["Homework"],
      summary: "Submit homework solution (with optional attachment)",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                attachments: { type: "string", format: "binary" },
                notes: { type: "string" }
              }
            }
          }
        }
      },
      responses: { 200: { description: "Homework submitted successfully." } }
    }
  }
};
